// app.js
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import productRoutes from './routes/product/products.js'
import 'dotenv/config.js'

const app = express()
const PORT = process.env.PORT || 3000

// 解析 __dirname（ESM 模式下需手動處理）
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 使用中介層
app.use(cors())
app.use(express.json())

// 提供靜態圖片資源（對應 imageUrl）
// app.use('/imgs', express.static(path.join(__dirname, 'public', 'imgs')))

// 掛載產品 API 路由
app.use('/products', productRoutes)

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`伺服器正在運行：http://localhost:${PORT}`)
})
