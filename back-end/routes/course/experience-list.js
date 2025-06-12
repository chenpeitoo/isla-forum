import express from 'express'
const router = express.Router()
import db from '../../config/mysql.js'

// Url: http://localhost:3005/api/course/experience-list/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params
  console.log('取得體驗課程 ID:', id)

  try {
    const [rows] = await db.execute(
      `
      SELECT 
        e.*, 
        c.name AS category_name,
        t.about AS teacher_about,
        t.banner AS teacher_banner,
        t.detail AS teacher_detail,
        t.website AS teacher_website,
        t.facebook AS teacher_facebook,
        t.instagram AS teacher_instagram,
        u.name AS teacher_name,
        u.nickname AS teacher_nickname,
        u.ava_url AS teacher_avatar,
        u.id
      FROM 
        courses_experience e
      LEFT JOIN 
        courses_experience_categories c ON e.categories_id = c.id
      LEFT JOIN 
        teachers t ON e.teachers_id = t.id
      LEFT JOIN 
        users u ON t.users_id = u.id
      WHERE 
        e.id = ?
    `,
      [id]
    )

    res.json({ status: 'success', data: rows })
  } catch (err) {
    console.error('撈取體驗課程失敗:', err)
    res.status(500).json({ status: 'false', message: '資料庫錯誤' })
  }
})

export default router
