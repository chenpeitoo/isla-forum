import mysql from 'mysql2/promise.js'

// 讀取.env檔用
import 'dotenv/config.js'

// 資料庫連結資訊
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  dateStrings: true, // 轉換日期字串格式用
  waitForConnections: true,
  connectionLimit: 10, // 最多同時 10 條連線
  queueLimit: 0, // 不限制等待
})

// 輸出模組
export default db
