import express from 'express'
import multer from 'multer'
import db from '../../config/mysql.js' // 使用mysql
import path from 'path'

const router = express.Router()

// 得到多筆文章
// 後端送出的post_user_liked, post_user_saved 為字串
router.get('/:pageName', async function (req, res) {
  // 取得userID
  const postsQuery = `SELECT 
        p.*,
        pc.id AS cate_id,
        pc.name AS cate_name,
        u.nickname AS user_nick,
        u.ava_url AS user_img,
        IFNULL (liked.user_ids, '') AS liked_user_ids,
        IFNULL( liked.likes, 0) AS likes,
        IFNULL (saved.user_ids, '') AS saved_user_ids,
        IFNULL (comment.count, 0) AS comment_count
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
    LEFT JOIN (
      SELECT post_id,
      COUNT(id) AS count
      FROM comment
      GROUP BY post_id
    ) comment ON p.id = comment.post_id
    WHERE p.valid=1`

  const userID = req.body.userID || req.query.userID || 0
  const pageName = req.params.pageName
  let postsResult
  let morePostsResult
  let isResultExist = true
  let otherPosts

  // const userID = req.query.userID || req.body.usrID || 0
  // if (!userID) return res.json({ status: 'success', data: '未登入成功' })

  switch (pageName) {
    case 'post-detail': {
      const postID = req.query.postID
      postsResult = await db.query(`${postsQuery} AND p.id=${postID}`)
      morePostsResult = await db.query(
        `${postsQuery} 
        AND p.cate_id = (SELECT cate_id FROM post WHERE id = ${postID}) 
        AND p.id != ${postID} ORDER BY likes DESC LIMIT 4`
      )
      // QU 為什麼likes不能是p.likes？
      // if (postsResult || morePostsResult) {
      return res.json({
        status: 'success',
        data: { posts: postsResult[0], morePosts: morePostsResult[0] },
      })
      // }
      // break
    }
    case 'home': {
      console.log('----------home---------')
      const tab = req.query.tab
      const keyword = req.query.keyword
      const productCate = req.query.productCate?.split(',')
      const postCate = req.query.postCate?.split(',')
      // console.log({ keyword, productCate, postCate })

      // WHERE p.title LIKE ? OR p.content LIKE ? AND p.cate_id = ? AND p.product_cate_id = ?
      // 冷靜的找到篩選問題是括號，我好棒！
      if (tab || keyword || productCate || postCate) {
        const tabValue = tab !== '1' ? 'updated_at' : 'likes'
        // console.log(tab, tabValue)
        postsResult = await db.query(`${postsQuery} ORDER BY ${tabValue} DESC`)
        if (keyword || productCate || postCate) {
          const keywordClause = keyword
            ? `(p.title LIKE ? OR p.content LIKE ?)`
            : ''
          //WHERE (p.title LIKE '%清爽%' OR p.content LIKE '%清爽%') AND ORDER BY updated_at DESC",
          const keywordValue = keyword ? `%${keyword}%` : ''
          const productClause = productCate
            ? `p.product_cate_id IN (${productCate.map((c) => '?').join(',')})`
            : ''
          const productValue = productCate ?? []
          const postClause = postCate
            ? `p.cate_id IN (${postCate.map((c) => '?').join(',')})`
            : ''
          const postValue = postCate ?? []

          const totalClause = [keywordClause, productClause, postClause]
            .filter((c) => c.length > 0)
            .join(' AND ')

          const totalValue = [
            keywordValue,
            keywordValue,
            ...productValue,
            ...postValue,
          ].filter(Boolean)

          postsResult = await db.query(
            `${postsQuery} AND ${totalClause} ORDER BY ${tabValue} DESC`,
            totalValue
          )
        }
      } else {
        postsResult = await db.query(`${postsQuery} ORDER BY likes DESC`)
        // const { page = '1', limit = '5' } = req.query
        // const offset = (parseInt(page) - 1) * parseInt(limit)

        // postsResult = await db.query(
        //   `${postsQuery} ORDER BY likes DESC LIMIT ? OFFSET ?`,
        //   [parseInt(limit), offset]
        // )
      }
      if (postsResult[0].length === 0) {
        isResultExist = false
        otherPosts = await db.query(`${postsQuery} ORDER BY likes DESC`)
      }
      // console.log('有資料')
      // console.log('---------' + isResultExist)
      break
    }
    case 'profile': {
      // req網址 http://localhost:3005/api/forum/posts/profile?authorID=${authorID}
      const authorID = req.query.authorID
      postsResult = await db.query(`${postsQuery} AND p.user_id = ${authorID}`)
      // user FIXME 判斷有無追蹤、userName等等
      break
    }
    case 'my-post': {
      postsResult = await db.query(
        `${postsQuery} AND p.user_id = ${userID} ORDER BY p.updated_at DESC`
      )
      break
    }
    case 'saved-post': {
      postsResult = await db.query(
        `${postsQuery} ORDER BY p.updated_at DESC LIMIT 4`
      )
      // console.log(postsResult[0])
      // postsResult[0] = postsResult[0].filter((p) =>
      //   p.saved_user_ids.split(',').map(Number).includes(userID)
      // )
      console.log(postsResult[0])
      break
    }
    case 'tidy': {
      postsResult = await db.query(postsQuery)
      break
    }
  }

  // const [posts] = postsResult
  return res.json({
    status: 'success',
    data: postsResult[0],
    isResultExist,
    otherPosts: otherPosts?.[0],
  })
})

// 新增一筆文章 - 網址：POST /api/forum/posts
const storage = multer.diskStorage({
  destination: path.join(import.meta.dirname, '../../public/images/forum'),
  // QU path是內建方法嗎？
  filename: (req, file, cb) => {
    const userID = req.body.userID
    const filename = path.basename(file.originalname)
    // const ext = path.extname(file.originalname)
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
    // console.log(req.body.postID)
    const [result] = await db.query(
      `UPDATE post SET title=?, content=?, updated_at=NOW(), user_id=?, cate_id=?, product_cate_id=? WHERE id=?`,
      [title, content, userID, postCate, productCate, postID]
    )
    if (result.affectedRows === 0) throw new Error('沒有資料被更改(put)')
    // console.log(result)
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
  // return res.json({ status: 'success', data: null })
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
