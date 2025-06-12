import express from 'express'
import db from '../../config/mysql.js'
const router = express.Router()

// import verifyToken from '../../lib/verify-token.js'
// import { getFilteredProducts } from '../services/product-controller.js'
router.get('/', async (req, res) => {
  try {
    const [brands] = await db.query(
      `SELECT brand_id, name FROM brands WHERE status = 'active'`
    )
    const [tags] = await db.query(
      `SELECT tag_id, name FROM product_tags WHERE status = 'active'`
    )
    const [categories] = await db.query(
      `SELECT category_id, name FROM categories WHERE status = 'active'`
    )

    res.json({ brands, categories, tags })
  } catch (error) {
    console.error('filter篩選項截取錯誤:', error)
    res.status(500).json({ error: '篩選項截取錯誤' })
  }
})

// For 後台 react select格式
router.get('/manage', async (req, res) => {
  try {
    const [brands] = await db.query(
      `SELECT brand_id AS value, name AS label FROM brands WHERE status = 'active'`
    )
    const [tags] = await db.query(
      `SELECT tag_id AS value, name AS label FROM product_tags WHERE status = 'active'`
    )
    const [categories] = await db.query(
      `SELECT category_id AS value, name AS label FROM categories WHERE status = 'active'`
    )

    res.json({ brands, categories, tags })
  } catch (error) {
    console.error('filter篩選項截取錯誤:', error)
    res.status(500).json({ error: '篩選項截取錯誤' })
  }
})

export default router
