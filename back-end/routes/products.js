import express from 'express'
const router = express.Router()
// import verifyToken from '../../lib/verify-token.js'
import { getFilteredProducts } from '../services/product-controller.js'
import db from '../config/mysql.js'

router.get('/', async (req, res) => {
  console.log('篩選參數:', req.query)

  try {
    const {
      keyword,
      brandIds,
      categoryIds,
      tagIds,
      minPrice,
      maxPrice,
      minRating,
      maxRating,
      onSaleOnly,
      offset = 0,
      limit = 20,
      sortBy,
      sortOrder,
      Colorful,
      colors,
    } = req.query

    function parseIdArray(param) {
      if (!param) return []
      if (Array.isArray(param))
        return param.map(Number).filter((n) => !isNaN(n))
      return param
        .split(',')
        .map(Number)
        .filter((n) => !isNaN(n))
    }

    const filters = {
      sortBy: sortBy || 'products.product_id',
      sortOrder: sortOrder || 'DESC',
      onSaleOnly: String(onSaleOnly).toLowerCase() === 'true',
      colors: parseIdArray(colors),
      Colorful: String(Colorful).toLowerCase() === 'true',
      keyword: keyword || '',
      brandIds: parseIdArray(brandIds),
      categoryIds: parseIdArray(categoryIds),
      tagIds: parseIdArray(tagIds),
      minPrice:
        minPrice !== undefined && minPrice !== '' ? parseFloat(minPrice) : null,
      maxPrice:
        maxPrice !== undefined && maxPrice !== '' ? parseFloat(maxPrice) : null,
      minRating:
        minRating !== undefined && minRating !== ''
          ? parseFloat(minRating)
          : null,
      maxRating:
        maxRating !== undefined && maxRating !== ''
          ? parseFloat(maxRating)
          : null,
      offset: Number.isInteger(parseInt(offset)) ? parseInt(offset) : 0,
      limit: Number.isInteger(parseInt(limit)) ? parseInt(limit) : 20,
    }

    // 你可以在這裡強制讓 minRating 為 null 表示不篩選最低分
    // 或者根據業務邏輯調整

    const result = await getFilteredProducts(filters)

    res.json({ status: 'success', data: result })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
})

router.post('/search', async (req, res) => {
  const { keyword = '' } = req.body

  try {
    let sql = `
      SELECT
        p.product_id,
        p.name AS title,
        p.base_price,
        p.sale_price,
        b.name AS brand,
        pi.image_url AS productImg,
        CASE 
          WHEN p.sale_price IS NOT NULL 
              AND NOW() >= p.sale_start_date
              AND NOW() <= p.sale_end_date
          THEN p.sale_price
          ELSE p.base_price
        END AS final_price
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      LEFT JOIN (
        SELECT product_id, MIN(image_url) AS image_url
        FROM product_images
        GROUP BY product_id
      ) pi ON pi.product_id = p.product_id
      WHERE p.status = 'active' AND p.name LIKE ?
    `
    const params = [`%${keyword}%`]

    const [rows] = await db.execute(sql, params)

    res.json({ status: 'success', data: rows })
  } catch (err) {
    console.error('[keyword search] 錯誤:', err)
    res.status(500).json({ status: 'error', message: err.message })
  }
})

export default router
