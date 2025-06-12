import jwt from 'jsonwebtoken'
import db from '../config/mysql.js'
const secretKey = process.env.JWT_SECRET_KEY
// verify token
const verifyOTP = async (req, res, next) => {
  let error = ''
  const { email } = req.body
  console.log(req.body)
  if (!email)
    return res.status(400).json({ status: 'error', message: '未提供 email' })
  // 搜尋 opt 的 token
  console.log(email)
  const query = 'SELECT otp FROM users WHERE email=?'
  const token = await db
    .execute(query, [email])
    .then((data) => data[0][0].otp)
    .catch((err) => {
      error = err.message
    })
  console.log(token)
  if (!token)
    return res
      .status(403)
      .json({ status: 'error', message: '資料庫未提供 Token: ' + error })
  // console.log('token: ', token)

  try {
    const decoded = jwt.verify(token, secretKey)
    req.otpMsg = decoded // 存入 req 供後續使用
    next()
  } catch (error) {
    res.status(401).json({ message: 'otp 無效或已過期' })
  }
}
export default verifyOTP
