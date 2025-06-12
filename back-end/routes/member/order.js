import express from 'express'
const router = express.Router()
import db from '../../config/mysql.js'
import verifyToken from '../../lib/verify-token.js' // token verification

// api settings

// get: Send data if Auth is ok
router.get('/', verifyToken, async (req, res) => {
  let error = {}
  // if verifyToken works, it would send user's id to req.user.id
  const id = req?.user?.id || 0

  // set query here
  try {
    const query = `SELECT * FROM orders WHERE user_id = ?`
    const orders = await db
      .execute(query, [id])
      .then((data) => data[0])
      .catch((err) => {
        error = err
      })
    // send user data to client
    res.json({
      status: 'success',
      data: orders,
      message: '訂單取得成功',
    })
  } catch (err) {
    res.json({ status: '訂單取得失敗', message: error })
  }
})

router.post('/item', verifyToken, async (req, res) => {
  let error = {}
  // if verifyToken works, it would send user's id to req.user.id
  const { id } = req?.body || 0
  console.log('order_id ', id)
  // set query here
  try {
    const query = `SELECT
     oi.product_id,
     oi.course_id,
     oi.course_experience_id,
     oi.price,
     oi.item_type,
     c.title AS course_tit,
     c.picture AS course_pic,
     ce.title AS experience_tit,
     ce.picture AS experience_pic,
     p.name AS product_tit,
     p.image_url AS product_pic
FROM order_items AS oi 
LEFT JOIN courses AS c ON c.id = oi.course_id
LEFT JOIN courses_experience AS ce ON ce.id = oi.course_experience_id
LEFT JOIN (SELECT 
    p.product_id,
    p.name,
    pi.image_url
FROM products AS p
LEFT JOIN (
    SELECT product_id, image_url
    FROM product_images
    WHERE sort_order = 1
) AS pi ON p.product_id = pi.product_id) AS p ON p.product_id = oi.product_id
WHERE oi.order_id = ?;
`
    const items = await db
      .execute(query, [id])
      .then((data) => data[0])
      .catch((err) => {
        error = err
      })
    if (!items) return res.json({ status: 'success', message: '無此商品' })
    // send user data to client
    res.json({
      status: 'success',
      data: items,
      message: '品項取得成功',
    })
  } catch (err) {
    res.json({ status: '品項取得失敗', message: error })
  }
})
router.post('/test', verifyToken, async (req, res) => {
  let error = {}
  // if verifyToken works, it would send user's id to req.user.id
  const { id } = req?.body || 0
  console.log('order_id ', id)
  // set query here
  try {
    const query = `SELECT 
    p.product_id,
    p.name,
    pi.image_url
FROM products AS p
LEFT JOIN (
    SELECT product_id, image_url
    FROM product_images
    WHERE sort_order = 1
) AS pi ON p.product_id = pi.product_id;
`
    const items = await db
      .execute(query, [id])
      .then((data) => data[0])
      .catch((err) => {
        error = err
      })
    if (!items) return res.json({ status: 'success', message: '無此商品' })
    // send user data to client
    res.json({
      status: 'success',
      data: items,
      message: '品項取得成功',
    })
  } catch (err) {
    res.json({ status: '品項取得失敗', message: error })
  }
})
export default router
