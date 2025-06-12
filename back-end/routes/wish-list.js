import express from 'express'
import db from '../config/mysql.js'
import verifyToken from '../lib/verify-token.js'

const router = express.Router()

router.get('/products', verifyToken, async (req, res) => {
  const user_id = req.user.id

  if (!user_id) {
    return res.status(401).json({ message: '未授權使用者' })
  }

  try {
    const [wishlist] = await db.execute(
      `SELECT 
     w.id AS wishlist_id,
     w.user_id,
     w.product_id,
     w.courses_id,
     w.courses_experience_id,
     w.created_at,
     p.product_id,
     p.name,
     p.description,
     p.usage_instructions,
     p.base_price,
     p.sale_price,
     p.status,
     CASE 
       WHEN p.sale_price IS NOT NULL 
         AND NOW() >= p.sale_start_date
         AND NOW() <= p.sale_end_date
       THEN p.sale_price
       ELSE p.base_price
     END AS final_price,
     b.brand_id,
     b.name AS brand_name,
     c.category_id,
     c.name AS category_name,
      (
        SELECT GROUP_CONCAT(pt.name)
        FROM product_tag_relations ptr
        JOIN product_tags pt ON ptr.tag_id = pt.tag_id
        WHERE ptr.product_id = p.product_id
      ) AS tag_names,
      (
        SELECT GROUP_CONCAT(pi.image_url)
        FROM product_images pi
        WHERE pi.product_id = p.product_id
      ) AS images

   FROM wishlist w
   INNER JOIN products p ON w.product_id = p.product_id
   LEFT JOIN brands b ON p.brand_id = b.brand_id
   LEFT JOIN categories c ON p.category_id = c.category_id
   WHERE w.user_id = ?`,
      [user_id]
    )
    const result = wishlist.map((row) => ({
      ...row,
      tag_names: row.tag_names ? row.tag_names.split(',') : [],
      images: row.images ? row.images.split(',') : [],
    }))

    res.json({
      message: '取得收藏清單+商品卡片資料成功',
      data: result,
    })
  } catch (err) {
    console.error('取得收藏失敗:', err)
    res.status(500).json({ message: '伺服器錯誤' })
  }
})

router.get('/', verifyToken, async (req, res) => {
  const user_id = req.user.id

  if (!user_id) {
    return res.status(401).json({ message: '未授權使用者' })
  }

  try {
    const [wishlist] = await db.execute(
      `SELECT id, user_id, courses_id, courses_experience_id, product_id, created_at
   FROM wishlist
   WHERE user_id = ?`,
      [user_id]
    )

    res.json({
      message: '取得收藏狀態資料成功',
      data: wishlist,
    })
  } catch (err) {
    console.error('取得收藏失敗:', err)
    res.status(500).json({ message: '伺服器錯誤' })
  }
})

router.post('/', verifyToken, async (req, res) => {
  const user_id = req.user.id
  const { courses_id, courses_experience_id, product_id } = req.body

  if (!user_id) {
    return res.status(401).json({ message: '未授權使用者' })
  }

  const fields = []
  const values = []

  if (courses_id) {
    fields.push('courses_id')
    values.push(courses_id)
  }

  if (courses_experience_id) {
    fields.push('courses_experience_id')
    values.push(courses_experience_id)
  }

  if (product_id) {
    fields.push('product_id')
    values.push(product_id)
  }

  if (fields.length !== 1) {
    return res.status(400).json({
      message:
        '只能傳入一種收藏類型（courses_id、courses_experience_id 或 product_id）',
    })
  }

  fields.push('user_id')
  values.push(user_id)

  fields.push('created_at')
  values.push(new Date()) // 這會被 mysql driver 自動轉成 datetime 格式

  try {
    const sql = `INSERT INTO wishlist (${fields.join(',')}) VALUES (${fields
      .map(() => '?')
      .join(',')})`
    await db.execute(sql, values)
    res.json({ message: '收藏成功' })
  } catch (err) {
    console.error('收藏失敗:', err)
    res.status(500).json({ message: '伺服器錯誤' })
  }
})

router.delete('/', verifyToken, async (req, res) => {
  const user_id = req.user.id
  const { courses_id, courses_experience_id, product_id } = req.body

  if (!user_id) {
    return res.status(401).json({ message: '未授權使用者' })
  }

  const conditions = []
  const values = []

  if (courses_id) {
    conditions.push('courses_id = ?')
    values.push(courses_id)
  }

  if (courses_experience_id) {
    conditions.push('courses_experience_id = ?')
    values.push(courses_experience_id)
  }

  if (product_id) {
    conditions.push('product_id = ?')
    values.push(product_id)
  }

  if (conditions.length !== 1) {
    return res.status(400).json({
      message:
        '請傳入一種收藏類型的ID (courses_id、courses_experience_id 或 product_id)',
    })
  }

  // 加上 user_id 條件，確保只能刪除自己的收藏
  values.push(user_id)
  const sql = `DELETE FROM wishlist WHERE ${conditions.join(
    ' AND '
  )} AND user_id = ?`

  try {
    const [result] = await db.execute(sql, values)
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '找不到該收藏紀錄' })
    }
    res.json({ message: '刪除成功' })
  } catch (err) {
    console.error('刪除收藏失敗:', err)
    res.status(500).json({ message: '伺服器錯誤' })
  }
})

export default router

//備份
// const [wishlist] = await db.execute(
//   `SELECT id, user_id, courses_id, courses_experience_id, product_id, created_at
//    FROM wishlist
//    WHERE user_id = ?`,
//   [user_id]
// )
