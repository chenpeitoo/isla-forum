import express from 'express'
const router = express.Router()
import db from '../../config/mysql.js'

// Url: http://localhost:3005/api/course/teacher-list/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const [rows] = await db.query(
      `
      SELECT
        t.id AS teachers_id,
        t.about,
        t.created_at AS teachers_created_at,
        t.banner,
        t.detail,
        t.status AS teachers_status,
        t.website,
        t.facebook,
        t.instagram,

        u.id AS users_id,
        u.name AS users_name,
        u.nickname,
        u.email,
        u.ava_url,
        u.gender,
        u.birthday,
        u.tel,
        u.city,
        u.area,
        u.address,
        u.skin_type,
        u.created_at AS users_created_at,
        u.point,
        u.level,
        u.is_teacher
      FROM teachers t
      LEFT JOIN users u ON t.users_id = u.id
      WHERE t.users_id = ?
    `,
      [id]
    )

    if (rows.length === 0) {
      return res.status(404).json({
        status: 'not_found',
        message: `找不到 user_id 為 ${id} 的講師資料`,
      })
    }

    return res.json({
      status: 'success',
      data: rows[0],
    })
  } catch (err) {
    console.error('撈取老師錯誤:', err)
    console.error('SQL 錯誤細節:', err.message)
    res.status(500).json({
      status: 'error',
      message: '伺服器錯誤，無法取得講師資料',
    })
  }
})

// Url: http://localhost:3005/api/course/teacher-course/:id
router.get('/teacher-course/:id', async (req, res) => {
  const { id } = req.params
  try {
    const [rows] = await db.query(
      `
      SELECT
        c.id,
        c.picture,
        c.title,
        c.student,
        c.price,
        c.discount,
        c.status,
        c.categories_id,
        c.tag,
        c.banner_video,
        c.course_chapter,
        c.video_length,
        c.detail,
        c.created,
        c.updated,
        c.remove,
        c.content,
        c.teacher_id,
        u.name AS teacher_name,
        COALESCE(AVG(cc.star), 0) AS avg_star,
        COUNT(cc.id) AS comment_count
      FROM courses c
       LEFT JOIN courses_comments cc ON c.id = cc.courses_id
      LEFT JOIN courses_categories cat ON c.categories_id = cat.id
      LEFT JOIN teachers t ON c.teacher_id=t.id
      LEFT JOIN users u ON t.users_id = u.id
      WHERE c.teacher_id = ?
      GROUP BY
        c.id, c.picture, c.title, c.student, c.price, c.discount, c.status,
        c.tag, c.created, c.categories_id, c.teacher_id, cat.name
      
      ORDER BY c.created DESC
    `,
      [id]
    )

    return res.json({
      status: 'success',
      data: rows,
    })
  } catch (err) {
    console.error('撈取老師課程錯誤:', err)
    res.status(500).json({
      status: 'error',
      message: '伺服器錯誤，無法取得課程資料',
    })
  }
})

export default router
