// routes/post.js
import express from 'express'
const router = express.Router()
import db from '../../config/mysql.js'

// GET http://localhost:3005/api/course/teacher-post/user/：userId
router.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId

  try {
    const [rows] = await db.query(
      `
      SELECT
        p.id,
        p.title,
        p.content,
        p.updated_at,
        p.valid,
        p.user_id,
        p.product_cate_id,
        p.articleURL,
        u.name AS author_name,
        u.ava_url AS avatar_url 
      FROM post p
      JOIN users u ON p.user_id = u.id
      WHERE p.valid = 1 AND p.user_id = ?
      ORDER BY p.updated_at DESC
      `,
      [userId]
    )

    res.json({
      status: 'success',
      data: rows,
    })
  } catch (err) {
    console.error('取得使用者文章錯誤:', err)
    res.status(500).json({ status: 'error', message: '伺服器錯誤' })
  }
})

export default router
