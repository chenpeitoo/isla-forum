import express from 'express'
import { getProductIngredient } from '../services/product-controller.js'
import db from '../config/mysql.js'

const router = express.Router()

router.get('/:id', async (req, res) => {
  try {
    const productId = parseInt(req.params.id)
    if (isNaN(productId)) return res.status(400).json({ error: 'ID格式錯誤' })

    const [ingredient] = await Promise.all([getProductIngredient(productId)])

    res.status(200).json({
      success: true,
      data: Object.values(ingredient), // 將 Object 轉為 Array
    })
  } catch (error) {
    res.status(404).json({ success: false, message: error.message })
  }
})

export default router
