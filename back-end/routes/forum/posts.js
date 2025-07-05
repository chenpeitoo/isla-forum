// 改進(1)避免sql injection (2)抽取postsQuery成函式 (3)統一data型別 (4)補上try/catch

import express from 'express'
import multer from 'multer'
import db from '../../config/mysql.js' // 使用mysql
import path from 'path'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'

const router = express.Router()
dayjs.extend(customParseFormat)

function buildPostsQuery({ where = '', order = '', limit = '' }) {
  let sql = `
    SELECT 
        p.*,
        pc.id AS cate_id,
        pc.name AS cate_name,
        u.nickname AS user_nick,
        u.ava_url AS user_img,
        IFNULL (liked.user_ids, '') AS liked_user_ids,
        IFNULL( liked.count + saved.count + comment.count, 0) AS popular,
        IFNULL (saved.user_ids, '') AS saved_user_ids,
        IFNULL (comment.count, 0) AS comment_count
    FROM post p
    JOIN post_category pc ON p.cate_id = pc.id
    JOIN users u ON p.user_id = u.id
    LEFT JOIN (
        SELECT post_id,
        GROUP_CONCAT(user_id) AS user_ids,
        COUNT(user_id) AS count
        FROM post_user_liked
        GROUP BY post_id
    ) liked ON p.id = liked.post_id
    LEFT JOIN (
        SELECT post_id,
        GROUP_CONCAT(user_id) AS user_ids,
        COUNT(user_id) AS count
        FROM post_user_saved
        GROUP BY post_id
    ) saved ON p.id = saved.post_id
    LEFT JOIN (
      SELECT post_id,
      COUNT(id) AS count
      FROM comment
      GROUP BY post_id
    ) comment ON p.id = comment.post_id
    WHERE p.valid = 1`
  if (where) sql += ` AND ${where}`
  if (order) sql += ` ORDER BY ${order}`
  if (limit) sql += ` LIMIT ${limit}`

  return sql
}
function tidy(data) {
  return data?.map((post) => {
    return {
      ...post,
      liked_user_ids: post.liked_user_ids
        ? post.liked_user_ids.split(',').map(Number)
        : [],
      saved_user_ids: post.saved_user_ids
        ? post.saved_user_ids.split(',').map(Number)
        : [],
      updated_at: dayjs(post.updated_at, 'YYYY-MM-DD HH:mm:ss'),
    }
  })
}

function parseNull(value) {
  if (value === undefined || value === null) return null // 沒帶參數
  if (value === '' || value === 'null' || value === 'undefined') return null
  return value // 保留原值
}

router.get('/home', async function (req, res) {
  try {
    const tabQuery = Number(req.query.tab)
    const keywordQuery = req.query.keyword
    const productCateQuery = req.query.productCate?.split(',').map(Number)
    const postCateQuery = req.query.postCate?.split(',').map(Number)

    const DEFAULT_MAX_POST_ID = 99999999999999
    const DEFAULT_MAX_CURSOR =
      tabQuery === 1 ? 99999999999999 : '3000:01:01 00:00:00'

    let sqlHome
    let posts
    let wherePlaceholder = []
    let whereParams = []

    if (keywordQuery) {
      wherePlaceholder.push(` (p.title LIKE ? OR p.content LIKE ?)`)
      whereParams.push(`%${keywordQuery}%`, `%${keywordQuery}%`)
    }
    if (productCateQuery) {
      wherePlaceholder.push(
        `p.product_cate_id IN (${productCateQuery.map(() => '?').join(',')})`
      )
      whereParams.push(...productCateQuery)
    }
    if (postCateQuery) {
      wherePlaceholder.push(
        `p.cate_id IN (${postCateQuery.map(() => '?').join(',')})`
      )
      whereParams.push(...postCateQuery)
    }

    // 接收請求中的cursor
    const cursor = parseNull(req.query.cursor) || DEFAULT_MAX_CURSOR
    const postID = parseNull(req.query.postID) || DEFAULT_MAX_POST_ID
    // console.log({ cursor, postID })

    // 組織sql where order子句
    let orderClause
    if (tabQuery === 1) {
      wherePlaceholder.push(`(
        IFNULL(liked.count + saved.count + comment.count, 0) < ? 
        OR (
          IFNULL(liked.count + saved.count + comment.count, 0) = ? 
          AND p.id < ?
        )
      )`)
      whereParams.push(cursor, cursor, postID)
      orderClause = `IFNULL(liked.count + saved.count + comment.count, 0) DESC, p.id DESC` //簡寫成popular則無法查詢
    } else if (tabQuery === 2) {
      wherePlaceholder.push(
        `(p.updated_at < ? OR (updated_at = ? AND p.id < ?))`
      )
      whereParams.push(cursor, cursor, postID)
      orderClause = `p.updated_at DESC, p.id DESC`
    }

    const whereClause = wherePlaceholder.join(' AND ')
    const limit = 5
    sqlHome = buildPostsQuery({
      where: whereClause,
      order: orderClause,
      limit: limit,
    })
    // console.log(sqlHome, { whereParams })

    posts = await db.query(sqlHome, whereParams)
    const postsData = posts[0] ?? []
    const postsTidy = tidy(postsData)

    // 製作lastCursor
    const last = postsTidy.at(-1)
    const lastCursor =
      posts[0].length === limit && tabQuery === 1
        ? { popular: last.popular, id: last.id }
        : posts[0].length === limit && tabQuery === 2
        ? {
            popular: last.updated_at.format('YYYY-MM-DD HH:mm:ss'),
            id: last.id,
          }
        : null // 若資料是最尾端了，則cursor為null

    return res.json({
      status: 'success',
      data: { posts: postsTidy, lastCursor },
    })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

router.get('/post-detail', async function (req, res) {
  try {
    const postID = req.query.postID
    const sqlDetail = buildPostsQuery({ where: `p.id = ${postID}` })
    const postsResult = await db.query(sqlDetail)

    const sqlMorePosts = buildPostsQuery({
      where: `p.cate_id = (SELECT cate_id FROM post WHERE id = ${postID}) AND p.id != ${postID} ORDER BY popular DESC LIMIT 4`,
    })
    const morePostsResult = await db.query(sqlMorePosts)

    console.log(sqlMorePosts)

    return res.json({
      status: 'success',
      data: { posts: postsResult[0], morePosts: morePostsResult[0] },
    })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

// 會員中心 - 我的收藏
router.get('/saved-post', async function (req, res) {
  try {
    const userID = Number(req.query.userID)
    if (!userID) throw new Error('無使用者編號')

    const whereClause = `EXISTS (SELECT 1 FROM post_user_saved saved WHERE saved.post_id = p.id AND saved.user_id = ? )`

    const orderClause = `p.updated_at DESC`

    const sqlHome = buildPostsQuery({
      where: whereClause,
      order: orderClause,
    })

    const posts = await db.query(sqlHome, [userID])
    const postsData = posts[0] ?? []
    const postsTidy = tidy(postsData)
    // console.log(sqlHome, { userID })
    return res.json({
      status: 'success',
      data: postsTidy,
    })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

// 會員中心 - 我的文章
router.get('/my-post', async function (req, res) {
  try {
    const userID = Number(req.query.userID)
    if (!userID) throw new Error('無使用者編號')

    const whereClause = `p.user_id = ?`
    const orderClause = `p.updated_at DESC`

    const sqlHome = buildPostsQuery({
      where: whereClause,
      order: orderClause,
      // limit: 9999999999999,
    })

    const posts = await db.query(sqlHome, [userID])
    const postsData = posts[0] ?? []
    const postsTidy = tidy(postsData)
    console.log(sqlHome, { userID, dataLength: postsTidy.length })
    return res.json({
      status: 'success',
      data: postsTidy,
    })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

// 論壇 - 創作者個人頁面
router.get('/profile', async function (req, res) {
  try {
    const authorID = Number(req.query.authorID)

    const whereClause = `p.user_id = ?`
    const orderClause = `p.updated_at DESC`

    const sqlHome = buildPostsQuery({
      where: whereClause,
      order: orderClause,
      // limit: 9999999999999,
    })

    const posts = await db.query(sqlHome, [authorID])
    const postsData = posts[0] ?? []
    const postsTidy = tidy(postsData)
    console.log(sqlHome, { dataLength: postsTidy.length })
    return res.json({
      status: 'success',
      data: postsTidy,
    })
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message })
  }
})

// 新增一筆文章 - 網址：POST /api/forum/posts
const storage = multer.diskStorage({
  destination: path.join(import.meta.dirname, '../../public/images/forum'),
  filename: (req, file, cb) => {
    const userID = req.body.userID
    const filename = path.basename(file.originalname)
    cb(null, `${userID}_${Date.now()}_${filename}`)
  },
})
const upload = multer({ storage })
// 上傳圖片
router.post(
  '/upload-image',
  upload.fields([{ name: 'images', maxCount: 50 }]),
  async function (req, res) {
    console.log(req)
    const files = req.files.images
    const filenames = files.map((f) => f.filename)
    console.log('req----' + filenames)
    return res.json({ filenames })
  }
)
// 新增文章
router.post('/', upload.none(), async function (req, res) {
  // const images = req.files.images
  const { title, content, userID, productCate, postCate } = req.body
  const [result] = await db.query(
    'INSERT INTO post(title, content, user_id, cate_id, product_cate_id) VALUES (?,?,?,?,?)',
    [title, content, userID, postCate, productCate]
  )

  if (result.affectedRows === 0) throw new Error('沒有資料被更改(put)')
  return res.json({
    status: 'success',
    data: null,
  })
})

// 修改文章 網址：PUT /api/forum/posts/:id
router.put('/', upload.none(), async function (req, res) {
  // 用try/catch捕獲了一個本來淹沒在終端機、看不出所以然的錯誤，覺得自己又更像工程師了
  try {
    const { postID, productCate, postCate, title, content, userID } = req.body
    const [result] = await db.query(
      `UPDATE post SET title=?, content=?, updated_at=NOW(), user_id=?, cate_id=?, product_cate_id=? WHERE id=?`,
      [title, content, userID, postCate, productCate, postID]
    )
    if (result.affectedRows === 0) throw new Error('沒有資料被更改(put)')
    return res.json({ status: 'success', data: null })
  } catch (error) {
    console.log(error)
    return res.json({ status: 'error', message: error.message })
  }
})

// 刪除文章  網址:DELETE /api/forum/posts/:id
router.put('/soft-delete/:postID', async function (req, res) {
  try {
    const id = Number(req.params.postID)
    // console.log(id)
    // const [result] = await db.query(`DELETE FROM post WHERE id=${id}`)
    const [result] = await db.query(`UPDATE post SET valid=0 WHERE id=${id}`)
    if (result.affectedRows === 0) throw new Error('沒有資料被刪除')
    return res.json({ status: 'success', dala: null })
  } catch (error) {
    return res.json({ status: 'error', message: error.message })
  }
})

// header 搜尋
// 標題title, 內文content（要塞在dangerouslySetInnerHTML內）, 分類cate_name, 作者名稱user_nick, 作者圖片user_img,
router.post('/header-search', async function (req, res) {
  const { keyword } = req.body
  try {
    const [result] = await db.query(
      `
      SELECT 
        p.*,
        pc.id AS cate_id,
        pc.name AS cate_name,
        u.nickname AS user_nick,
        u.ava_url AS user_img,
        IFNULL (liked.user_ids, '') AS liked_user_ids,
        IFNULL( liked.likes, 0) AS likes,
        IFNULL (saved.user_ids, '') AS saved_user_ids
    FROM post p
    JOIN post_category pc ON p.cate_id = pc.id
    JOIN users u ON p.user_id = u.id
    LEFT JOIN (
        SELECT post_id,
        GROUP_CONCAT(user_id) AS user_ids,
        COUNT(user_id) AS likes
        FROM post_user_liked
        GROUP BY post_id
    ) liked ON p.id = liked.post_id
    LEFT JOIN (
        SELECT post_id,
        GROUP_CONCAT(user_id) AS user_ids
        FROM post_user_saved
        GROUP BY post_id
    ) saved ON p.id = saved.post_id
    WHERE p.valid=1 AND (p.title LIKE ? OR p.content LIKE ?)`,
      [`%${keyword}%`, `%${keyword}%`]
    )

    return res.json({ status: 'success', data: result })
  } catch (error) {
    console.log(error)
    return res.json({ status: 'error', message: error.message })
  }
})

export default router
