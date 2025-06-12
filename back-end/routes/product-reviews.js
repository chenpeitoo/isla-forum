import express from 'express'
import multer from 'multer'
import {
  getProductReviews,
  saveOrUpdateReview,
  getUserReviewForProduct,
} from '../services/product-controller.js'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

router.get('/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id)
    if (isNaN(productId)) return res.status(400).json({ error: 'ID格式錯誤' })

    const [reviews] = await Promise.all([getProductReviews(productId)])

    res.status(200).json({
      success: true,
      data: Object.values(reviews), // 將 Object 轉為 Array
    })
  } catch (error) {
    res.status(404).json({ success: false, message: error.message })
  }
})

router.get('/user/check', async (req, res) => {
  try {
    const { product_id, user_id } = req.query
    if (!product_id || !user_id) {
      return res.status(400).json({ error: '缺少參數' })
    }

    const review = await getUserReviewForProduct(user_id, product_id)

    if (!review) {
      return res.status(200).json({ success: true, data: null })
    }

    return res.status(200).json({ success: true, data: review })
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message })
  }
})

router.post('/save', upload.array('image[]', 3), async (req, res) => {
  try {
    const { product_id, rating, context, review_id, imageToDelete } = req.body
    if (!product_id || !rating || !context) {
      return res.status(400).json({ error: '缺少參數' })
    }
    console.log('product_id', product_id)
    const user_id = req.body.user_id || null
    console.log('user_id', user_id)
    if (!user_id) {
      return res.status(401).json({ error: '非法存取' })
    }
    const images = req.files || []

    const result = await saveOrUpdateReview({
      product_id,
      user_id,
      rating,
      context,
      review_id,
      imageToDelete: JSON.parse(imageToDelete || '[]'),
      images,
    })

    res.status(200).json({ success: true, data: result })
  } catch (error) {
    console.error('API /save error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
