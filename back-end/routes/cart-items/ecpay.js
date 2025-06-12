import express from 'express'
import * as crypto from 'crypto'
import verifyToken from '../../lib/verify-token.js'

const router = express.Router()

// 測試商店參數（綠界提供）
const MerchantID = '3002607'
const HashKey = 'pwFHCqoQZGmho4w6'
const HashIV = 'EkRm7iFT261dpevs'

const stage = true
const APIURL = `https://payment${
  stage ? '-stage' : ''
}.ecpay.com.tw/Cashier/AioCheckOut/V5`

function generateTradeNo() {
  const now = new Date()
  return `od${now.getFullYear()}${(now.getMonth() + 1)
    .toString()
    .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now
    .getHours()
    .toString()
    .padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now
    .getSeconds()
    .toString()
    .padStart(2, '0')}${now.getMilliseconds().toString().padStart(3, '0')}`
}

// 清洗商品名稱，避免特殊符號
function cleanItemName(name) {
  return name
    .replace(/[^\w\u4e00-\u9fa5\-()]/g, '') // 只允許中文字、英數、底線、() 和 -
    .replace(/\s+/g, '') // 去掉空白（可選）
}

// 用清洗後的名稱產生 ItemName
function getItemName(items) {
  if (!Array.isArray(items)) return '線上購買商品'
  return items
    .map((item) => `${cleanItemName(item.name)}X${item.quantity}`)
    .join('#')
}

// 安全格式化日期，符合綠界格式要求
function formatDateToECPayFormat(date = new Date()) {
  const pad = (n) => n.toString().padStart(2, '0')
  const yyyy = date.getFullYear()
  const MM = pad(date.getMonth() + 1)
  const dd = pad(date.getDate())
  const hh = pad(date.getHours())
  const mm = pad(date.getMinutes())
  const ss = pad(date.getSeconds())
  return `${yyyy}/${MM}/${dd} ${hh}:${mm}:${ss}`
}

function generateCheckMacValue(params) {
  const sorted = Object.entries(params).sort(([a], [b]) => a.localeCompare(b))
  const query = sorted.map(([k, v]) => `${k}=${v}`).join('&')
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

  console.log('🔍 CheckMacValue 原始字串：', raw)
  console.log('🔍 編碼後字串：', encoded)
  console.log('🔍 最終雜湊結果：', hash)
  return hash
}

router.post('/', verifyToken, (req, res) => {
  const { amount, items, orderNumber } = req.body
  console.log('🟠 收到的 req.body:', req.body)

  if (!amount || !items || !Array.isArray(items)) {
    return res.status(400).send('缺少必要欄位')
  }

  const tradeNo = generateTradeNo()
  const tradeDate = formatDateToECPayFormat()
  console.log(tradeDate)

  const params = {
    MerchantID,
    MerchantTradeNo: tradeNo,
    MerchantTradeDate: tradeDate,
    PaymentType: 'aio',
    TotalAmount: amount.toString(),
    TradeDesc: 'beauty_products_checkout',
    // TradeDesc: '購買美妝相關產品'.replace(/[^a-zA-Z0-9_\s]/g, ''),
    ItemName: getItemName(items),
    ReturnURL: 'https://www.ecpay.com.tw',
    ClientBackURL: `http://localhost:3000/cart/order-completed`,
    ChoosePayment: 'Credit',
    EncryptType: 1,
    CustomField1: orderNumber,
  }

  const checkMacValue = generateCheckMacValue(params)
  const allParams = { ...params, CheckMacValue: checkMacValue }

  const formInputs = Object.entries(allParams)
    .map(([key, val]) => `<input type="hidden" name="${key}" value="${val}" />`)
    .join('\n')

  const html = `
    <!DOCTYPE html>
    <html>
    <body>
      <form id="ecpay-form" method="POST" action="${APIURL}">
        ${formInputs}
      </form>
      <script>
        document.getElementById('ecpay-form').submit();
      </script>
    </body>
    </html>
  `

  res.send(html)
})

export default router
