import express from 'express'
const router = express.Router()
import db from '../../config/mysql.js'
import verifyToken from '../../lib/verify-token.js'

// POST http://localhost:3005/api/cart-items/clear
router.post('/', verifyToken, async (req, res) => {
  const user_id = req.user.id

  try {
    await db.execute('DELETE FROM cart_items WHERE user_id = ?', [user_id])
    res.json({ status: 'success', message: '購物車已清空' })
  } catch (err) {
    console.error('清空購物車失敗:', err)
    res.status(500).json({ status: 'fail', message: '清空購物車時發生錯誤' })
  }
})

export default router
