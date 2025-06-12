import express from 'express'
import db from '../../config/mysql.js'
import verifyToken from '../../lib/verify-token.js'

const router = express.Router()

// POST http://localhost:3005/api/cart-items/create
router.post('/', verifyToken, async (req, res) => {
  console.log('🧾 req.body', req.body)
  const user_id = req.user.id
  const {
    product_id = null,
    course_id = null,
    course_experience_id = null,
    color_id = null,
    quantity = 1,
  } = req.body

  if (!user_id) {
    return res.status(401).json({ status: 'fail', message: '請登入會員' })
  }

  if (!product_id && !course_id && !course_experience_id) {
    return res.status(400).json({ status: 'fail', message: '請提供加入的項目' })
  }

  try {
    // 檢查是否已存在相同項目（根據 user + 商品類型 + color）
    const [existing] = await db.query(
      `
      SELECT id, quantity FROM cart_items
      WHERE user_id = ?
      AND product_id <=> ?
      AND course_id <=> ?
      AND course_experience_id <=> ?
      AND color_id <=> ?
      `,
      [user_id, product_id, course_id, course_experience_id, color_id]
    )

    if (existing.length > 0) {
      // 課程，禁止重複加入
      if (course_id || course_experience_id) {
        return res.status(400).json({
          status: 'fail',
          message: '此課程已加入購物車，無法重複加入',
        })
      }

      // 商品已在購物車，累加數量
      const newQty = existing[0].quantity + quantity
      await db.query(`UPDATE cart_items SET quantity = ? WHERE id = ?`, [
        newQty,
        existing[0].id,
      ])
      return res.json({
        status: 'success',
        message: '購物車項目已更新數量',
      })
    } else {
      // 不存在：新增一筆
      await db.query(
        `
        INSERT INTO cart_items
        (user_id, product_id, course_id, course_experience_id, color_id, quantity)
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          user_id,
          product_id,
          course_id,
          course_experience_id,
          color_id,
          quantity,
        ]
      )
      return res.json({
        status: 'success',
        message: '成功加入購物車',
      })
    }
  } catch (err) {
    console.error('加入購物車失敗:', err)
    return res.status(500).json({
      status: 'error',
      message: '資料庫錯誤',
    })
  }
})

export default router
