import express from 'express'
import db from '../config/mysql.js'
import {
  getProductDetail,
  getProductName,
  updateProduct,
  getProductById,
  createProduct,
  deleteProduct,
} from '../services/product-controller.js'
import multer from 'multer'
//驗證格式套件
import { body, validationResult } from 'express-validator'
const upload = multer({
  storage: multer.memoryStorage(),
  // limits: {
  //   fileSize: 5 * 1024 * 1024, // 5 MB (單位是 bytes)
  // },
})
const router = express.Router()

const parseProductData = (req, res, next) => {
  if (!req.body.data) {
    return res
      .status(400)
      .json({ success: false, message: '請求中缺少 "data" 欄位' })
  }
  try {
    // 將解析後的 JSON 物件掛載到 req 上，方便後續使用
    req.productData = JSON.parse(req.body.data)
    next()
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: '"data" 欄位中的 JSON 格式錯誤' })
  }
}

router.get('/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id)
    if (isNaN(productId)) return res.status(400).json({ error: 'ID格式錯誤' })

    const [product, reviews] = await Promise.all([getProductDetail(productId)])

    res.json({
      success: true,
      data: {
        ...product,
        reviews,
      },
    })
  } catch (error) {
    res.status(404).json({ success: false, message: error.message })
  }
})

router.get('/bread/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id)
    if (isNaN(productId)) return res.status(400).json({ error: 'ID格式錯誤' })

    const name = await getProductName(productId)

    res.json({
      success: true,
      data: {
        ...name,
      },
    })
  } catch (error) {
    res.status(404).json({ success: false, message: error.message })
  }
})

router.get('/edit/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id)
    if (isNaN(productId)) return res.status(400).json({ error: 'ID格式錯誤' })

    const [product, ingredients] = await Promise.all([
      getProductById(productId),
    ])

    res.json({
      success: true,
      data: {
        ...product,
        ...ingredients,
      },
    })
  } catch (error) {
    res.status(404).json({ success: false, message: error.message })
  }
})

router.put(
  '/edit/:id',
  // 1. 使用 express.json() 來解析 application/json 格式的請求體
  express.json(),

  // 2. 驗證規則 (保持不變，因為它們是針對 JSON 欄位的)
  [
    body('name').notEmpty().withMessage('商品名稱為必填'),
    body('base_price').isFloat({ min: 0 }).withMessage('基本價格格式不正確'),
    body('status')
      .isIn(['active', 'draft', 'archived'])
      .withMessage('狀態值無效'),
    body('category_id').notEmpty().isInt().withMessage('商品分類為必填'),
    body('brand_id').notEmpty().isInt().withMessage('品牌為必填'),
    body('images').isArray().withMessage('圖片必須是陣列格式'),
  ],

  // 3. 處理驗證結果並呼叫控制器
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() })
    }
    updateProduct(req, res)
  }
)

router.post('/create', createProduct)

router.delete('/:id', deleteProduct)

export default router
