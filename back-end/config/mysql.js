import mysql from 'mysql2/promise.js'

// 讀取.env檔用
import 'dotenv/config.js'

// 資料庫連結資訊
const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSERNAME,
  port: process.env.MYSQLPORT,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  dateStrings: true, // 轉換日期字串格式用
  waitForConnections: true,
  connectionLimit: 10, // 最多同時 10 條連線
  queueLimit: 0, // 不限制等待
})

// 輸出模組
export default db
