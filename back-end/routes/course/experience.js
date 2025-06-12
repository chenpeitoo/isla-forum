import express from 'express'
const router = express.Router()
import db from '../../config/mysql.js'

// Url: http://localhost:3005/api/course/experience
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        e.*, 
        c.name AS category_name
      FROM 
        courses_experience e
      LEFT JOIN 
        courses_experience_categories c 
        ON e.categories_id = c.id
    `)

    res.json({ status: 'success', data: rows })
  } catch (err) {
    console.error('撈取體驗課程失敗:', err)
    res.status(500).json({ status: 'false', message: '資料庫錯誤' })
  }
})

export default router
