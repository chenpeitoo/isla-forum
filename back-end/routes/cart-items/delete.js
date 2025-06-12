import express from 'express'
const router = express.Router()
import db from '../../config/mysql.js'
import verifyToken from '../../lib/verify-token.js'

// DELETE /api/cart-items/delete/:id
router.delete('/:id', verifyToken, async (req, res) => {
  const user_id = req.user.id
  const cartItemId = req.params.id

  try {
    const [result] = await db.execute(
      `DELETE FROM cart_items WHERE id = ? AND user_id = ?`,
      [cartItemId, user_id]
    )

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ status: 'fail', message: '找不到該購物車商品' })
    }

    res.json({ status: 'success', message: '已刪除購物車商品' })
  } catch (err) {
    console.error('刪除錯誤:', err)
    res.status(500).json({ status: 'error', message: '資料庫錯誤' })
  }
})

export default router
