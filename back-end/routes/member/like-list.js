import express from 'express'
const router = express.Router()
import db from '../../config/mysql.js'
import verifyToken from '../../lib/verify-token.js' // token verification

// api settings

// get: Send data if Auth is ok
router.get('/product', verifyToken, async (req, res) => {
  let error = {}
  // if verifyToken works, it would send user's id to req.user.id
  const id = req?.user?.id || 0

  // set query here
  try {
    const query = `SELECT * FROM products WHERE id=?`
    const product = await db
      .execute(query, [id])
      .then((data) => data[0][0])
      .catch((err) => {
        error = err
      })
    // send user data to client
    res.json({
      status: 'success',
      data: product,
      message: '登入成功',
    })
  } catch (err) {
    res.json({ status: 'error', message: error })
  }
})

router.get('/course', verifyToken, async (req, res) => {
  let error = {}
  // if verifyToken works, it would send user's id to req.user.id
  const id = req?.user?.id || 0
  console.log('id ', id)

  // set query here
  try {
    const query = `SELECT
        c.id,
        c.picture,
        c.title,
        c.student,
        c.price,
        c.discount,
        c.status,
        c.tag,
        c.created,
        c.categories_id,
        c.teacher_id,
        cat.name AS category_name,
        u.name AS teacher_name,
        wl.user_id AS wish_user,
        COALESCE(AVG(cc.star), 0) AS avg_star,
        COUNT(cc.id) AS comment_count
      FROM courses c
      LEFT JOIN courses_comments cc ON c.id = cc.courses_id
      LEFT JOIN courses_categories cat ON c.categories_id = cat.id
      LEFT JOIN teachers t ON c.teacher_id=t.id
      LEFT JOIN users u ON t.users_id = u.id
      LEFT JOIN wishlist as wl ON wl.courses_id = c.id
      WHERE wl.user_id = ?
      GROUP BY
        c.id, c.picture, c.title, c.student, c.price, c.discount, c.status,
        c.tag, c.created, c.categories_id, c.teacher_id, cat.name
      ORDER BY c.created ASC`
    const course = await db
      .execute(query, [id])
      .then((data) => data[0])
      .catch((err) => {
        error = err
      })
    if (!course) return res.json({ status: 'success', message: '沒有收藏課程' })
    // send user data to client
    res.json({
      status: 'success',
      data: course,
      message: '取得收藏課程成功',
    })
  } catch (err) {
    res.json({ status: 'error', message: error })
  }
})

// api settings

// get: Send data if Auth is ok
router.post('/', verifyToken, async (req, res) => {
  let error = {}
  // if verifyToken works, it would send user's id to req.user.id
  const id = req?.user?.id || 0
  let item = { type: '', id: 0 }
  const { courses_id, courses_experience_id, product_id } = req.body
  console.log('product_id', product_id)
  if (product_id) {
    item.type = 'product_id'
    item.id = product_id
  } else if (courses_id) {
    item.type = 'courses_id'
    item.id = courses_id
  } else if (courses_experience_id) {
    item.type = 'courses_experience_id'
    item.id = courses_experience_id
  }
  // switch (true) {
  // case courses_id:
  //   item.type = 'courses_id'
  //   item.id = courses_id
  //   break
  // case courses_experience_id:
  //   item.type = 'courses_experience_id'
  //   item.id = courses_experience_id
  //   break
  //   case product_id:
  //     item.type = 'product_id'
  //     item.id = product_id
  //     break
  // }
  console.log('like-list-delete item: ', item)
  // set query here
  if (item.type === '' || item.id === 0)
    return res.status(400).json({ status: 'error', message: '輸入item錯誤' })
  try {
    const query = `DELETE FROM wishlist WHERE user_id = ? AND ${item.type} = ?;`
    const response = await db
      .execute(query, [id, item.id])
      .then((data) => data[0][0])
      .catch((err) => {
        error = err.message
      })
    // send user data to client
    res.json({
      status: 'success',
      data: response,
      message: `刪除${item.type}:${item.id}成功`,
    })
  } catch (err) {
    res.status(400).json({ status: 'error', message: '刪除失敗' + error })
  }
})

export default router
