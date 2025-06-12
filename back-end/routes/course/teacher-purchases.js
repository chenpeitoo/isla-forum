import express from 'express'
const router = express.Router()
import db from '../../config/mysql.js'

// GET http://localhost:3005/api/course/teacher-purchases/:userId
router.get('/:userId', async (req, res) => {
  const teacherId = req.params.userId

  const sql = `
  (
    SELECT
      oi.id AS order_item_id,
      o.order_number,
      o.created_at,
      '課程' AS type,
      c.id,
      c.title,
      c.tag,
      c.picture,
      c.price,
      c.discount,
      t.name AS teacher_name
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    JOIN courses c ON oi.course_id = c.id
    JOIN teachers te ON c.teacher_id = te.id
    JOIN users t ON te.users_id = t.id
  WHERE o.user_id = ? AND oi.course_id IS NOT NULL
  GROUP BY
    oi.id, o.order_number, o.created_at,
    c.title, c.tag, c.student, c.picture,
    c.price, c.discount, t.name
  )
  UNION
  (
    SELECT
    oi.id AS order_item_id,
    o.order_number,
    o.created_at,
    '體驗' AS type,
    ce.id ,
    ce.title,
    ce.tag,
    ce.picture,
    ce.price,
    ce.discount,
    t.name AS teacher_name
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    JOIN courses_experience ce ON oi.course_experience_id = ce.id
    JOIN teachers te ON ce.teachers_id = te.id
    JOIN users t ON te.users_id = t.id
    WHERE o.user_id = ? AND oi.course_experience_id IS NOT NULL
  )
  ORDER BY created_at DESC;
`

  try {
    const [results] = await db.query(sql, [teacherId, teacherId])
    res.json({
      status: 'success',
      data: results,
    })
  } catch (err) {
    console.error('查詢老師購買過的課程失敗:', err)
    res.status(500).json({ status: 'error', message: '伺服器錯誤' })
  }
})

export default router
