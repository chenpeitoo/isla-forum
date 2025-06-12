import db from '../config/mysql.js'
import { uploadImageAndGetUrl } from './product-picture-upload-service.js'

import express from 'express'
const app = express()

// 假設圖片實體放在 ./public/images/member/image_2.jpg
app.use('/images', express.static('public/images'))

export async function getFilteredProducts(filters) {
  const {
    keyword,
    onSaleOnly,
    brandIds,
    categoryIds,
    tagIds,
    minPrice,
    maxPrice,
    minRating,
    maxRating,
    limit = 20,
    offset = 0,
    sortOrder,
    sortBy,
    colors,
  } = filters

  const allowedSortMap = {
    final_price: 'final_price',
    average_rating: 'review_summary.avg_rating',
    created_at: 'products.created_at',
  }
  let sortValue = allowedSortMap[filters.sortBy] || 'products.product_id'
  // console.log('sortBy:', sortBy)
  console.log('sortValue:', sortValue)
  console.log('sortOrder:', sortOrder)
  const onSaleFlag = Boolean(onSaleOnly)
  console.log('onSaleFlag:', onSaleFlag)
  const conditions = []
  const params = []

  // 建立 SQL 查詢的基本部分
  let sql = `
    SELECT 
      products.product_id,
      products.name,
      products.status,
      products.description,
      products.base_price,
      products.sale_price,
      products.sale_start_date,
      products.sale_end_date,
      products.created_at,
      products.updated_at,
      brand.brand_id AS brand_id,
      brand.name AS brand_name,
      category.name AS category_name,
      primary_image.image_url AS primary_image_url,
      review_summary.review_count,
      review_summary.avg_rating,
      GROUP_CONCAT(DISTINCT product_color_stocks.color_id) AS color_ids,
      GROUP_CONCAT(
        DISTINCT CONCAT(
          colors.color_id, ':',
          colors.color_name, ':',
          colors.color_code, ':',
          product_color_stocks.stock_quantity
        )
        SEPARATOR '---'
      ) AS color_details,
      SUM(product_color_stocks.stock_quantity) AS total_stock,
      GROUP_CONCAT(DISTINCT product_tags.name ORDER BY product_tags.name) AS tag_names,
      CASE 
        WHEN products.sale_price IS NOT NULL 
             AND NOW() >= products.sale_start_date
             AND NOW() <= products.sale_end_date
        THEN products.sale_price
        ELSE products.base_price
      END AS final_price,
      CASE 
        WHEN products.sale_price IS NOT NULL 
             AND NOW() >= products.sale_start_date
             AND NOW() <= products.sale_end_date
        THEN TRUE
        ELSE FALSE
      END AS is_on_sale
    FROM products
    JOIN brands brand ON products.brand_id = brand.brand_id
    JOIN categories category ON products.category_id = category.category_id
    LEFT JOIN (
      SELECT product_id, MIN(image_url) AS image_url
      FROM product_images
      WHERE is_primary = 1
      GROUP BY product_id
    ) AS primary_image ON primary_image.product_id = products.product_id
    LEFT JOIN (
      SELECT 
        product_id, 
        COUNT(*) AS review_count, 
        ROUND(AVG(rating), 1) AS avg_rating
      FROM product_reviews
      WHERE status = 'approved'
      GROUP BY product_id
    ) AS review_summary ON review_summary.product_id = products.product_id
    LEFT JOIN product_color_stocks ON product_color_stocks.product_id = products.product_id
    LEFT JOIN colors ON product_color_stocks.color_id = colors.color_id
    LEFT JOIN product_tag_relations ON product_tag_relations.product_id = products.product_id
    LEFT JOIN product_tags ON product_tags.tag_id = product_tag_relations.tag_id
  `

  // 篩選
  if (brandIds && brandIds.length > 0) {
    conditions.push(
      `products.brand_id IN (${brandIds.map(() => '?').join(',')})`
    )
    params.push(...brandIds)
  }
  if (categoryIds && categoryIds.length > 0) {
    conditions.push(
      `products.category_id IN (${categoryIds.map(() => '?').join(',')})`
    )
    params.push(...categoryIds)
  }
  if (tagIds && tagIds.length > 0) {
    conditions.push(`
      products.product_id IN (
        SELECT product_id
        FROM product_tag_relations
        WHERE tag_id IN (${tagIds.map(() => '?').join(',')})
        GROUP BY product_id
        HAVING COUNT(DISTINCT tag_id) = ${tagIds.length}
      )
    `)
    params.push(...tagIds)
  }
  if (minPrice !== undefined && minPrice !== null) {
    conditions.push(`
      CASE 
        WHEN products.sale_price IS NOT NULL 
             AND NOW() >= products.sale_start_date
             AND NOW() <= products.sale_end_date
        THEN products.sale_price
        ELSE products.base_price
      END >= ?
    `)
    params.push(minPrice)
  }
  if (maxPrice !== undefined && maxPrice !== null) {
    conditions.push(`
      CASE 
        WHEN products.sale_price IS NOT NULL 
             AND NOW() >= products.sale_start_date
             AND NOW() <= products.sale_end_date
        THEN products.sale_price
        ELSE products.base_price
      END <= ?
    `)
    params.push(maxPrice)
  }
  if (
    minRating !== undefined &&
    minRating !== null &&
    maxRating !== undefined &&
    maxRating !== null
  ) {
    conditions.push(
      `(
      (review_summary.avg_rating IS NOT NULL AND review_summary.avg_rating BETWEEN ? AND ?)
      OR review_summary.avg_rating IS NULL
    )`
    )
    params.push(minRating, maxRating)
  } else if (minRating !== undefined && minRating !== null) {
    conditions.push(
      `(
      (review_summary.avg_rating IS NOT NULL AND review_summary.avg_rating >= ?)
      OR review_summary.avg_rating IS NULL
    )`
    )
    params.push(minRating)
  } else if (maxRating !== undefined && maxRating !== null) {
    conditions.push(
      `(
      (review_summary.avg_rating IS NOT NULL AND review_summary.avg_rating <= ?)
      OR review_summary.avg_rating IS NULL
    )`
    )
    params.push(maxRating)
  }

  // 關鍵字搜尋
  if (keyword) {
    const loweredKeyword = `%${keyword.toLowerCase()}%`
    conditions.push(`
    (
      LOWER(products.name) LIKE ?
      OR LOWER(brand.name) LIKE ?
      OR LOWER(category.name) LIKE ?
      OR EXISTS (
        SELECT 1
        FROM product_tags pt
        JOIN product_tag_relations ptr ON ptr.tag_id = pt.tag_id
        WHERE ptr.product_id = products.product_id
        AND LOWER(pt.name) LIKE ?
      )
    )
  `)
    params.push(loweredKeyword, loweredKeyword, loweredKeyword, loweredKeyword)
  }

  //只顯示特價開關，判斷特價欄位及日期
  if (onSaleFlag) {
    conditions.push(`
    products.sale_price IS NOT NULL
    AND NOW() >= products.sale_start_date
    AND NOW() <= products.sale_end_date
  `)
  }

  if (filters.Colorful) {
    conditions.push(`
    products.product_id IN (
      SELECT product_id
      FROM product_color_stocks
      GROUP BY product_id
      HAVING COUNT(DISTINCT color_id) > 1
    )
  `)
  }
  conditions.push(`products.status = 'active'`)

  if (colors && colors.length > 0) {
    conditions.push(
      `product_color_stocks.color_id IN (${colors.map(() => '?').join(',')})`
    )
    params.push(...colors)
  }

  // 添加 WHERE 子句（如果需要）
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ')
  }

  // GROUP BY, ORDER BY, LIMIT 和 OFFSET
  sql += `
    GROUP BY products.product_id
    ORDER BY ${sortValue} ${sortOrder === 'desc' ? 'DESC' : 'ASC'}
    LIMIT ${limit} OFFSET ${offset};
  `

  try {
    // DEBUG
    // console.log('==== SQL ====')
    // console.log(sql)
    // console.log('==== Params ====')
    // console.log(params)
    // console.log(
    //   `Params length: ${params.length}, Placeholders count: ${
    //     (sql.match(/\?/g) || []).length
    //   }`
    // )
    try {
      const [rows] = await db.query(sql, params)
      rows.forEach((row) => {
        row.color_details = parseColorDetails(row.color_details)
      })
      return rows
    } catch (queryError) {
      console.error('Error:', queryError)
      throw queryError
    }
  } catch (error) {
    console.error('SQL Run Time Error:', error)
    throw error
  }
}

function parseColorDetails(colorDetailsString) {
  if (!colorDetailsString) return []

  const seen = new Set()
  return colorDetailsString
    .split('---')
    .map((entry) => {
      const [color_id, color_name, color_code, stock_quantity] =
        entry.split(':')
      const key = `${color_id}`

      if (seen.has(key)) return null
      seen.add(key)

      return {
        color_id: parseInt(color_id),
        color_name: color_name || null,
        color_code: color_code || null,
        stock_quantity: parseInt(stock_quantity),
      }
    })
    .filter(Boolean)
}

export async function getProductDetail(productId) {
  const [productRows] = await db.query(
    `
    SELECT 
      products.product_id, 
      products.name, 
      products.description, 
      products.usage_instructions,
      products.base_price, 
      products.sale_start_date,
      products.sale_price, 
      products.sale_end_date,
      products.status,
      brands.brand_id, 
      brands.name AS brand_name,
      categories.category_id, 
      categories.name AS category_name,
      product_tag_relations.tag_id,
      product_tags.name AS tag_name,
      -- 計算最終價格（促銷價 or 原價）
      CASE 
        WHEN products.sale_price IS NOT NULL 
            AND NOW() >= products.sale_start_date
            AND NOW() <= products.sale_end_date
        THEN products.sale_price
        ELSE products.base_price
      END AS final_price
    FROM products
    LEFT JOIN brands ON products.brand_id = brands.brand_id
    LEFT JOIN product_tag_relations ON products.product_id = product_tag_relations.product_id
    LEFT JOIN product_tags ON product_tag_relations.tag_id = product_tags.tag_id
    LEFT JOIN categories ON products.category_id = categories.category_id
    WHERE products.product_id = ?
  `,
    [productId]
  )

  if (productRows.length === 0) {
    throw new Error('找不到商品')
  }

  const product = productRows[0]

  // 顏色與庫存
  const [colors] = await db.query(
    `
    SELECT product_color_stocks.color_id, product_color_stocks.stock_quantity,
           colors.color_name, colors.color_code
    FROM product_color_stocks
    JOIN colors ON product_color_stocks.color_id = colors.color_id
    WHERE product_color_stocks.product_id = ?
  `,
    [productId]
  )

  // 圖片
  const [images] = await db.query(
    `
    SELECT image_id, image_url
    FROM product_images
    WHERE product_id = ?
  `,
    [productId]
  )
  // 平均評分
  const [avgResult] = await db.query(
    `
    SELECT ROUND(AVG(rating), 1) AS average_rating
    FROM product_reviews
    WHERE product_id = ?
  `,
    [productId]
  )

  const tags = productRows
    .filter((row) => row.tag_id && row.tag_name)
    .map((row) => ({
      tag_id: row.tag_id,
      name: row.tag_name,
    }))

  const average_rating = avgResult[0].average_rating || 0

  // 組合回傳資料
  return {
    product_id: product.product_id,
    name: product.name,
    description: product.description,
    usage_instructions: product.usage_instructions,
    base_price: product.base_price,
    sale_start_date: product.sale_start_date,
    sale_price: product.sale_price,
    sale_end_date: product.sale_end_date,
    final_price: product.final_price,
    status: product.status,
    brand: {
      brand_id: product.brand_id,
      name: product.brand_name,
    },
    category: {
      category_id: product.category_id,
      name: product.category_name,
    },
    tags,
    colors,
    images,
    average_rating,
  }
}

export async function getProductName(productId) {
  const [productRows] = await db.query(
    `
    SELECT products.name
    FROM products
    WHERE products.product_id = ?
    `,
    [productId]
  )

  if (productRows.length === 0) {
    throw new Error('找不到商品')
  }

  return {
    name: `商品詳細： ${productRows[0].name}`,
  }
}
export async function getProductReviews(productId) {
  // TODO: 需與user資料表JOIN，取得使用者名稱
  const [reviews] = await db.query(
    `SELECT
         product_reviews.review_id,
         product_reviews.user_id,
         product_reviews.rating,
         product_reviews.comment_text,
         product_reviews.is_anonymous,
         product_reviews.created_at,
         product_reviews.stock_id,
         users.nickname,
         users.ava_url,
         users.skin_type
       FROM product_reviews
              JOIN users ON product_reviews.user_id = users.id
       WHERE product_reviews.product_id = ? AND product_reviews.status = 'approved'
       ORDER BY product_reviews.created_at DESC`,
    [productId]
  )

  const reviewResults = await Promise.all(
    reviews.map(async (review) => {
      const { review_id, stock_id } = review
      const [images] = await db.query(
        `SELECT image_url FROM review_images WHERE review_id = ?`,
        [review_id]
      )

      let color = null
      if (stock_id) {
        const [[stock]] = await db.query(
          `SELECT color_id FROM product_color_stocks WHERE stock_id = ?`,
          [stock_id]
        )
        if (stock?.color_id) {
          const [[colorInfo]] = await db.query(
            `SELECT color_id, color_name, color_code FROM colors WHERE color_id = ?`,
            [stock.color_id]
          )
          if (colorInfo) {
            color = colorInfo
          }
        }
      }

      return {
        ...review,
        images: images.map((img) => img.image_url),
        color,
      }
    })
  )

  return reviewResults
}

export async function getProductIngredient(productId) {
  // 成分
  const [ingredients] = await db.query(
    `
    SELECT ingredients.ingredient_id, ingredients.name, ingredients.is_sensitive, ingredients.warning_message
    FROM product_ingredients
    JOIN ingredients ON product_ingredients.ingredient_id = ingredients.ingredient_id
    WHERE product_ingredients.product_id = ?
  `,
    [productId]
  )

  return ingredients
}

//http://localhost:3005/api/product-reviews/user/check?product_id=133812&user_id=52
export async function getUserReviewForProduct(userId, productId) {
  const [reviewRows] = await db.query(
    `SELECT review_id, product_id, user_id, rating, comment_text, created_at
     FROM product_reviews
     WHERE user_id = ? AND product_id = ? AND status = 'approved'`,
    [userId, productId]
  )
  if (reviewRows.length === 0) return null
  const review = reviewRows[0]
  const [imageRows] = await db.query(
    `SELECT review_image_id, image_url FROM review_images WHERE review_id = ?`,
    [review.review_id]
  )
  const images = imageRows.map((img) => ({
    id: img.review_image_id,
    url: img.image_url,
  }))
  return {
    review,
    images,
  }
}

export async function saveOrUpdateReview({
  product_id,
  user_id,
  rating,
  context,
  review_id,
  imageToDelete,
  images,
}) {
  //GPT建議：使用SQL交易機制，若失敗可以撤消所有操作，保護資料表
  //GPT建議：使用村民交易機制，若失敗可以毆打村民
  const conn = await db.getConnection()
  try {
    await conn.beginTransaction()
    let newReviewId = review_id
    if (!review_id) {
      // 新增評論
      const [insertRes] = await conn.execute(
        `INSERT INTO product_reviews (product_id, user_id, rating, comment_text)
         VALUES (?, ?, ?, ?)`,
        [product_id, user_id, rating, context]
      )
      newReviewId = insertRes.insertId
    } else {
      // 更新評論
      await conn.execute(
        `UPDATE product_reviews
         SET rating = ?, comment_text = ?
         WHERE review_id = ? AND user_id = ?`,
        [rating, context, review_id, user_id]
      )
    }

    if (Array.isArray(imageToDelete) && imageToDelete.length > 0) {
      const target = imageToDelete.map(() => '?').join(',')
      await conn.execute(
        `DELETE FROM review_images
         WHERE review_image_id IN (${target}) AND review_id = ?`,
        [...imageToDelete, newReviewId]
      )
    }

    const imageUrls = await Promise.all(
      images.map((file) => uploadImageAndGetUrl(file.buffer, file.originalname))
    )

    for (const imgurl of imageUrls) {
      await conn.execute(
        `INSERT INTO review_images (review_id, image_url) VALUES (?, ?)`,
        [newReviewId, imgurl]
      )
    }

    //跟村民交易（請準備綠寶石
    await conn.commit()
  } catch (error) {
    //失敗回滾所有操作
    console.error('saveOrUpdateReview error:', error)
    await conn.rollback()
    throw error
  } finally {
    conn.release()
  }
}

//整合資料for後台編輯器
export async function getProductById(productId) {
  try {
    const product = await getProductDetail(productId)
    const ingredients = await getProductIngredient(productId)

    return {
      product,
      ingredients,
    }
  } catch (error) {
    console.error(error)
    if (error.message === '找不到商品') {
      return res.status(404).json({ success: false, message: error.message })
    }
    return res.status(500).json({ success: false, message: '伺服器錯誤' })
  }
}

// PUT /products/:id
export async function updateProduct(req, res) {
  // 資料已經由中介軟體解析和驗證完畢
  const productId = parseInt(req.params.id, 10)
  const productData = req.body

  console.log('=== updateProduct Controller 開始 ===')
  console.log('Product ID:', productId)
  console.log('接收到的產品資料:', productData)

  const {
    name,
    description,
    usage_instructions,
    ingredients_text,
    brand_id,
    category_id,
    base_price,
    sale_price,
    sale_start_date,
    sale_end_date,
    status,
    is_featured,
    colors: color_stocks = [], // 從 productData 解構
    images: allImageUrls = [], // 這是要保留的既有圖片 URL 列表
    tag_ids = [],
  } = productData

  let conn
  try {
    conn = await db.getConnection()
    await conn.beginTransaction()
    console.log('資料庫交易開始')

    // 1. 更新商品基本資料 (與您原本的邏輯相同)
    console.log('=== 步驟 1: 更新商品基本資料 ===')
    await conn.query(
      `UPDATE products SET 
        name = ?, brand_id = ?, category_id = ?, base_price = ?, status = ?, 
        sale_price = ?, sale_start_date = ?, sale_end_date = ?, description = ?, 
        usage_instructions = ?, ingredients_text = ?, is_featured = ?, updated_at = ? 
      WHERE product_id = ?`,
      [
        name,
        parseInt(brand_id),
        parseInt(category_id),
        parseFloat(base_price),
        status || 'active',
        sale_price ? parseFloat(sale_price) : null,
        sale_start_date || null,
        sale_end_date || null,
        description || null,
        usage_instructions || null,
        ingredients_text || null,
        is_featured === true ? 1 : 0,
        new Date(),
        productId,
      ]
    )

    // 2. 處理並上傳新圖片
    console.log('=== 步驟 2: 更新資料庫中的圖片 URL ===')
    await conn.query(`DELETE FROM product_images WHERE product_id = ?`, [
      productId,
    ])
    console.log(`已刪除 Product ID ${productId} 的所有舊圖片關聯`)

    if (allImageUrls.length > 0) {
      const imageInsertData = allImageUrls.map((url, index) => [
        productId,
        url,
        index + 1, // sort_order
        index === 0 ? 1 : 0, // is_primary
      ])
      await conn.query(
        `INSERT INTO product_images (product_id, image_url, sort_order, is_primary) VALUES ?`,
        [imageInsertData]
      )
      console.log(`已插入 ${allImageUrls.length} 筆新圖片關聯`)
    }

    // 4. 更新 color_stocks (您的邏輯很完善，這裡僅作微調以適應新結構)
    console.log('=== 步驟 3: 更新 Color Stocks ===')
    await conn.query(`DELETE FROM product_color_stocks WHERE product_id = ?`, [
      productId,
    ])

    for (const cs of color_stocks) {
      console.log(`處理 color_stock:`, cs)
      let colorId = cs.color_id

      // --- 開始：整合後的「查詢或新增顏色 ID」邏輯 ---
      if (!colorId && (cs.color_name || cs.color_code)) {
        console.log('查詢或新增顏色:', {
          color_name: cs.color_name,
          color_code: cs.color_code,
        })

        // 先查詢是否存在該顏色
        const [existingColor] = await conn.query(
          `SELECT color_id FROM colors WHERE color_name = ? OR color_code = ?`,
          [cs.color_name, cs.color_code]
        )

        if (existingColor.length > 0) {
          colorId = existingColor[0].color_id
          console.log('找到現有顏色 ID:', colorId)
        } else {
          // 新增顏色
          console.log('新增新顏色:', {
            color_name: cs.color_name,
            color_code: cs.color_code,
          })
          const [insertColorResult] = await conn.query(
            `INSERT INTO colors (color_name, color_code) VALUES (?, ?)`,
            [cs.color_name, cs.color_code || '#000000']
          )

          colorId = insertColorResult.insertId

          // 如果 insertId 獲取失敗，嘗試備用方案
          if (!colorId) {
            console.log('insertId 獲取失敗，嘗試查詢剛插入的顏色')
            const [newColor] = await conn.query(
              `SELECT color_id FROM colors WHERE color_name = ? AND color_code = ? ORDER BY color_id DESC LIMIT 1`,
              [cs.color_name, cs.color_code || '#000000']
            )
            if (newColor.length > 0) {
              colorId = newColor[0].color_id
              console.log('通過查詢獲取到 color_id:', colorId)
            }
          }
          console.log('新增顏色完成，最終 color_id:', colorId)
        }
      }

      if (!colorId) {
        console.error(`color_stock 缺少 color_id 且無法新增:`, cs)
        throw new Error(
          `顏色項目缺少必要的識別資訊 (color_id, color_name 或 color_code)`
        )
      }
      // --- 結束：查詢或新增顏色 ID 的邏輯 ---

      // 使用找到或新增的 colorId 來插入 product_color_stocks
      await conn.query(
        `INSERT INTO product_color_stocks (product_id, color_id, price, stock_quantity, image_url, status) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          productId,
          parseInt(colorId),
          cs.price ? parseFloat(cs.price) : parseFloat(base_price),
          cs.stock_quantity ? parseInt(cs.stock_quantity, 10) : 0,
          cs.image_url || null,
          cs.status || 'in_stock',
        ]
      )
    }
    console.log('Color Stocks 更新完成')

    // 5. 更新 tags (您的邏輯很完善，直接使用)
    console.log('=== 步驟 5: 更新標籤 ===')
    await conn.query(`DELETE FROM product_tag_relations WHERE product_id = ?`, [
      productId,
    ])
    if (tag_ids.length > 0) {
      const tagInsertData = tag_ids.map((tagId) => [productId, parseInt(tagId)])
      await conn.query(
        `INSERT INTO product_tag_relations (product_id, tag_id) VALUES ?`,
        [tagInsertData]
      )
    }
    console.log('標籤更新完成')

    await conn.commit()
    console.log('=== 交易提交成功 ===')
    res.json({ success: true, message: '商品更新成功' })
  } catch (err) {
    console.error('=== updateProduct 發生錯誤 ===', err)
    if (conn) await conn.rollback()
    res.status(500).json({ success: false, message: '伺服器內部錯誤' })
  } finally {
    if (conn) conn.release()
  }
}

export async function createProduct(req, res) {
  // 從請求主體中解構出所有前端傳來的資料
  const {
    name,
    description,
    brand_id,
    category_id,
    base_price,
    sale_price = null,
    sale_start_date = null,
    sale_end_date = null,
    status = 'active',
    images: imageUrls = [],
    colors: colorStocks = [],
    tag_ids = [],
    ingredient_ids = [], // 接收新增的成分 ID 列表
  } = req.body

  console.log('=== createProduct Controller 開始 ===')
  console.log('接收到的產品資料:', req.body)

  // 確保必要的顏色和圖片資料存在
  if (!colorStocks || colorStocks.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: '商品至少需要一種顏色規格。' })
  }
  if (!imageUrls || imageUrls.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: '商品至少需要一張圖片。' })
  }

  let conn
  try {
    // 取得資料庫連線並開始一個事務
    conn = await db.getConnection()
    await conn.beginTransaction()
    console.log('資料庫交易開始')

    // --- 步驟 1: 新增商品基本資料到 `products` 資料表 ---
    console.log('=== 步驟 1: 新增商品基本資料 ===')
    const [productResult] = await conn.query(
      `INSERT INTO products 
        (name, description, brand_id, category_id, base_price, sale_price, sale_start_date, sale_end_date, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        description || null,
        parseInt(brand_id),
        parseInt(category_id),
        parseFloat(base_price),
        sale_price ? parseFloat(sale_price) : null,
        sale_start_date || null,
        sale_end_date || null,
        status,
        new Date(),
        new Date(),
      ]
    )

    const newProductId = productResult.insertId
    // 如果無法取得新商品的 ID，事務失敗
    if (!newProductId) {
      throw new Error('無法建立商品主體，無法取得 newProductId')
    }
    console.log(`商品主體建立成功, newProductId: ${newProductId}`)

    // --- 步驟 2: 新增商品圖片到 `product_images` 資料表 ---
    console.log('=== 步驟 2: 新增商品圖片 ===')
    const imageInsertData = imageUrls.map((url, index) => [
      newProductId,
      url,
      index + 1, // sort_order
      index === 0 ? 1 : 0, // is_primary (第一張設為主圖)
    ])
    await conn.query(
      `INSERT INTO product_images (product_id, image_url, sort_order, is_primary) VALUES ?`,
      [imageInsertData]
    )
    console.log(`已插入 ${imageUrls.length} 筆圖片關聯`)

    // --- 步驟 3: 新增顏色庫存到 `product_color_stocks` 資料表 ---
    // (這裡的邏輯與您提供的更新邏輯幾乎相同，只是使用 newProductId)
    console.log('=== 步驟 3: 新增顏色與庫存 ===')
    for (const stock of colorStocks) {
      // 驗證傳入的資料是否有效
      if (!stock.color_name) {
        console.error('收到的顏色規格缺少 color_name:', stock)
        // 在事務中，拋出錯誤會觸發 rollback
        throw new Error('顏色項目缺少必要的 color_name 資訊')
      }

      // --- 開始：修正後的「查詢或新增顏色 ID」邏輯 ---

      // 1. 只根據唯一的 color_name 來查詢顏色是否存在
      const [existingColors] = await conn.query(
        `SELECT color_id FROM colors WHERE color_name = ?`,
        [stock.color_name]
      )

      let colorId

      if (existingColors.length > 0) {
        // 2. 如果找到了，直接使用現有的 color_id
        colorId = existingColors[0].color_id
        console.log(`找到現有顏色 '${stock.color_name}', ID: ${colorId}`)
      } else {
        // 3. 如果沒找到，才執行 INSERT 操作來新增這個新顏色
        console.log(`未找到顏色 '${stock.color_name}', 準備新增...`)
        const [newColorResult] = await conn.query(
          `INSERT INTO colors (color_name, color_code) VALUES (?, ?)`,
          [stock.color_name, stock.color_code || '#000000'] // 提供一個預設色碼以防萬一
        )
        colorId = newColorResult.insertId
        console.log(`新增顏色成功, 新 ID: ${colorId}`)
      }

      // 再次確認是否成功獲取 colorId
      if (!colorId) {
        throw new Error(`無法處理或建立顏色: ${stock.color_name}`)
      }
      // --- 結束：修正後的「查詢或新增顏色 ID」邏輯 ---

      // 4. 使用獲取到的 colorId 來插入 product_color_stocks 關聯表
      await conn.query(
        `INSERT INTO product_color_stocks (product_id, color_id, stock_quantity) VALUES (?, ?, ?)`,
        [newProductId, colorId, parseInt(stock.stock_quantity, 10) || 0]
      )
    }
    console.log(`已插入 ${colorStocks.length} 筆顏色庫存關聯`)
    // --- 步驟 4: 新增商品標籤到 `product_tag_relations` 資料表 ---
    console.log('=== 步驟 4: 新增標籤關聯 ===')
    if (tag_ids && tag_ids.length > 0) {
      const tagInsertData = tag_ids.map((tagId) => [
        newProductId,
        parseInt(tagId),
      ])
      await conn.query(
        `INSERT INTO product_tag_relations (product_id, tag_id) VALUES ?`,
        [tagInsertData]
      )
      console.log(`已插入 ${tag_ids.length} 筆標籤關聯`)
    }

    // --- 步驟 5: 新增商品成分到 `product_ingredients` 資料表 ---
    console.log('=== 步驟 5: 新增成分關聯 ===')
    if (ingredient_ids && ingredient_ids.length > 0) {
      const ingredientInsertData = ingredient_ids.map((ingredientId) => [
        newProductId,
        parseInt(ingredientId),
      ])
      await conn.query(
        `INSERT INTO product_ingredients (product_id, ingredient_id) VALUES ?`,
        [ingredientInsertData]
      )
      console.log(`已插入 ${ingredient_ids.length} 筆成分關聯`)
    }

    // --- 所有步驟成功，提交事務 ---
    await conn.commit()
    console.log('=== 交易提交成功 ===')

    // 回傳 201 Created 狀態碼，並附上成功訊息與新商品的 ID
    res.status(201).json({
      success: true,
      message: '商品新增成功！',
      productId: newProductId,
    })
  } catch (err) {
    // 如果過程中發生任何錯誤，回滾所有操作
    console.error('=== createProduct 發生錯誤 ===', err)
    if (conn) await conn.rollback()

    // 回傳 500 伺服器內部錯誤
    res.status(500).json({
      success: false,
      message: err.message || '伺服器內部錯誤，無法新增商品。',
    })
  } finally {
    // 無論成功或失敗，最後都釋放資料庫連線
    if (conn) conn.release()
    console.log('資料庫連線已釋放')
  }
}

export async function deleteProduct(req, res) {
  const productId = parseInt(req.params.id, 10)

  if (isNaN(productId)) {
    return res.status(400).json({ success: false, message: '無效的商品 ID' })
  }

  console.log(
    `=== softDeleteProduct Controller 開始，目標 ID: ${productId} ===`
  )

  try {
    const sqlQuery = `
      UPDATE products 
      SET 
        status = 'deleted', 
        updated_at = ? 
      WHERE 
        product_id = ?;
    `
    const [result] = await db.query(sqlQuery, [new Date(), productId])

    if (result.affectedRows === 0) {
      console.log(`找不到 ID 為 ${productId} 的商品，無法進行軟刪除。`)
      return res
        .status(404)
        .json({ success: false, message: '找不到指定的商品' })
    }

    console.log(`ID 為 ${productId} 的商品已成功標記為刪除`)
    res.status(200).json({ success: true, message: '商品已成功設為刪除' })
  } catch (err) {
    console.error('=== softDeleteProduct 發生錯誤 ===', err)
    res
      .status(500)
      .json({ success: false, message: '伺服器內部錯誤，操作失敗。' })
  }
}
