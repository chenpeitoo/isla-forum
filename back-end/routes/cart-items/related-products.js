import express from 'express'
import db from '../../config/mysql.js'

const router = express.Router()

// GET /api/cart-items/related-products?brand=Unleashia&type=柔霧腮紅
router.get('/', async (req, res) => {
  const { brand = '', type = '' } = req.query

  // 檢查至少要有一個關鍵字
  if (!brand.trim() && !type.trim()) {
    return res.status(400).json({
      status: 'fail',
      message: '請至少提供一個查詢關鍵字（brand 或 type）',
    })
  }

  try {
    const sql = `
      SELECT 
      p.product_id,
      p.name,
      p.base_price,
      p.sale_price,
      pi.image_url
    FROM products p
    LEFT JOIN product_images pi 
      ON p.product_id = pi.product_id AND pi.is_primary = 1
    WHERE (? = '' OR p.name LIKE ?)
      AND (? = '' OR p.name LIKE ?)
    `

    const params = [brand, `%${brand}%`, type, `%${type}%`]

    const [rows] = await db.query(sql, params)

    res.json({
      status: 'success',
      data: { products: rows },
    })
  } catch (err) {
    console.error('查詢錯誤:', err.message)
    res.status(500).json({ status: 'fail', message: '伺服器錯誤' })
  }
})

export default router
