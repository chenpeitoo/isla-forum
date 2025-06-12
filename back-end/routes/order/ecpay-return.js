import express from 'express'
import * as crypto from 'crypto'
import db from '../../config/mysql.js'

const router = express.Router()

// 綠界參數
const HashKey = 'pwFHCqoQZGmho4w6'
const HashIV = 'EkRm7iFT261dpevs'

// 驗證 CheckMacValue 的方法
function generateCheckMacValue(params) {
  // Step 1: 排除 CheckMacValue 並排序
  const sorted = Object.entries(params)
    .filter(([key]) => key !== 'CheckMacValue')
    .sort(([a], [b]) => a.localeCompare(b))

  const query = sorted.map(([key, val]) => `${key}=${val}`).join('&')
  const raw = `HashKey=${HashKey}&${query}&HashIV=${HashIV}`

  const encoded = encodeURIComponent(raw)
    .toLowerCase()
    .replace(/%20/g, '+')
    .replace(/%21/g, '!')
    .replace(/%2a/g, '*')
    .replace(/%28/g, '(')
    .replace(/%29/g, ')')

  const hash = crypto
    .createHash('sha256')
    .update(encoded)
    .digest('hex')
    .toUpperCase()

  return hash
}

router.post('/', express.urlencoded({ extended: false }), async (req, res) => {
  const data = req.body
  console.log('📥 綠界回傳資料:', data)

  const {
    MerchantTradeNo,
    RtnCode,
    RtnMsg,
    PaymentDate,
    TradeAmt,
    CustomField1: orderNumber,
    CheckMacValue,
  } = data

  // 檢查必要欄位
  if (!orderNumber || !CheckMacValue || !MerchantTradeNo) {
    console.warn('缺少必要欄位')
    return res.send('0|ERR')
  }

  // 驗證 CheckMacValue
  // const check = generateCheckMacValue(data)
  // if (check !== CheckMacValue) {
  //   console.warn('CheckMacValue 錯誤')
  //   return res.send('0|ERR')
  // }
  // ✅ 成功付款代碼：1
  if (RtnCode === '1') {
    try {
      const [result] = await db.execute(
        'UPDATE orders SET status = ?, updated_at = NOW() WHERE order_number = ?',
        ['completed', orderNumber]
      )

      if (result.affectedRows === 0) {
        console.warn(`找不到訂單：${orderNumber}`)
        return res.send('0|ERR')
      }

      console.log(`訂單更新成功：${orderNumber}`)
      return res.send('1|OK')
    } catch (err) {
      console.error('更新資料庫錯誤', err)
      return res.send('0|ERR')
    }
  } else {
    console.warn(`付款失敗：${RtnMsg}`)
    return res.send('0|ERR')
  }
})

export default router
