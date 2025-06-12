import express from 'express'
const router = express.Router()
import db from '../../config/mysql.js'
import verifyToken from '../../lib/verify-token.js'

/**
 * ✅ GET 收藏清單
 * URL: GET /api/course/wishlist
 * 說明：查詢 wishlist 並同時帶出對應課程或體驗資料
 */
router.get('/', verifyToken, async (req, res) => {
  const userId = req.user.id

  try {
    const [rows] = await db.query(
      `
      SELECT 
        w.*,
        c.title AS course_title, c.picture AS course_picture,
        e.title AS exp_title, e.picture AS exp_picture
      FROM wishlist w
      LEFT JOIN courses c ON w.courses_id = c.id
      LEFT JOIN courses_experience e ON w.courses_experience_id = e.id
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC
      `,
      [userId]
    )
    res.json({ status: 'success', data: rows })
  } catch (error) {
    console.error(error)
    res.status(500).json({ status: 'error', message: '伺服器錯誤' })
  }
})

/**
 * ✅ POST 加入收藏（課程或體驗）
 * URL: POST /api/course/wishlist
 */
router.post('/', verifyToken, async (req, res) => {
  const { user_id, courses_id = null, courses_experience_id = null } = req.body
  if (!user_id || (!courses_id && !courses_experience_id)) {
    return res.status(400).json({ message: '缺少參數' })
  }

  try {
    await db.query(
      `
      INSERT IGNORE INTO wishlist (user_id, courses_id, courses_experience_id, created_at)
      VALUES (?, ?, ?, NOW())
      `,
      [user_id, courses_id, courses_experience_id]
    )
    res.json({ message: '收藏成功' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: '收藏失敗' })
  }
})

/**
 * ✅ DELETE 移除收藏（課程或體驗）
 * URL: DELETE /api/course/wishlist
 */
router.delete('/', verifyToken, async (req, res) => {
  const { user_id, courses_id = null, courses_experience_id = null } = req.body
  if (!user_id || (!courses_id && !courses_experience_id)) {
    return res.status(400).json({ message: '缺少參數' })
  }

  try {
    await db.query(
      `
      DELETE FROM wishlist 
      WHERE user_id = ?
      AND (
        (courses_id = ? AND ? IS NOT NULL)
        OR 
        (courses_experience_id = ? AND ? IS NOT NULL)
      )
      `,
      [
        user_id,
        courses_id,
        courses_id,
        courses_experience_id,
        courses_experience_id,
      ]
    )
    res.json({ message: '取消收藏成功' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: '取消收藏失敗' })
  }
})

export default router
