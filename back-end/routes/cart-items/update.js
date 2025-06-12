import express from 'express'
const router = express.Router()
import db from '../../config/mysql.js'
import verifyToken from '../../lib/verify-token.js'

// PATCH /api/cart-items/update/:id
router.patch('/:id', verifyToken, async (req, res) => {
  const cartItemId = req.params.id
  const { quantity } = req.body
  const user_id = req.user.id

  if (typeof quantity !== 'number' || quantity < 1) {
    return res.status(400).json({ status: 'fail', message: '數量必須為正整數' })
  }

  try {
    const [result] = await db.execute(
      `UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?`,
      [quantity, cartItemId, user_id]
    )

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ status: 'fail', message: '找不到該購物車商品' })
    }
    console.log(`cart-items_id：${cartItemId} 購物車商品數量已更新`)
    res.json({
      status: 'success',
      message: '購物車商品數量已更新',
      data: { cartItemId, quantity },
    })
  } catch (err) {
    console.error('更新錯誤:', err)
    res.status(500).json({ status: 'error', message: '資料庫錯誤' })
  }
})

export default router
