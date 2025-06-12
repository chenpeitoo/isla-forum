import express from 'express'
const router = express.Router()
import db from '../../config/mysql.js'

//Url:http://localhost:3005/api/course/course
router.get('/', async (req, res) => {
  try {
    const [course] = await db.query(`
      SELECT
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
        COALESCE(AVG(cc.star), 0) AS avg_star,
        COUNT(cc.id) AS comment_count
      FROM courses c
      LEFT JOIN courses_comments cc ON c.id = cc.courses_id
      LEFT JOIN courses_categories cat ON c.categories_id = cat.id
      LEFT JOIN teachers t ON c.teacher_id=t.id
      LEFT JOIN users u ON t.users_id = u.id
      GROUP BY
        c.id, c.picture, c.title, c.student, c.price, c.discount, c.status,
        c.tag, c.created, c.categories_id, c.teacher_id, cat.name
      ORDER BY c.created DESC
    `)
    // ✅ 補上完整圖片網址
    const formattedCourses = course.map((c) => {
      return {
        ...c,
        picture: c.picture ? `/images/course/bannerall/${c.picture}` : null,
      }
    })

    res.json({ status: 'success', data: course })
  } catch (err) {
    console.error('撈取課程錯誤:', err)
    res.status(500).json({ status: 'false', message: '連接資料庫錯誤' })
  }
})

export default router
