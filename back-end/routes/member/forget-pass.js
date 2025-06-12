import express from 'express'
const router = express.Router()
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { body } from 'express-validator'
// ==== method ====
import db from '../../config/mysql.js'
import sendOTPEmail from '../../middlewares/emailServiece.js'
// ==== middle ware ====
import {
  validateEmail,
  validateRequest,
} from '../../middlewares/express-valid-member.js'
import checkEmail from '../../middlewares/checkEmail.js'
import verifyOTP from '../../lib/verify-token-otp.js'

// api settings

// get: Send data if Auth is ok
// const otpStore = {}

router.post(
  '/otp',
  validateEmail,
  validateRequest,
  checkEmail,
  async (req, res) => {
    const { email } = req.body
    if (!email)
      return res.status(400).json({ status: 'error', message: '請提供 Email' })

    // ==== 設定 OTP ====
    const otp = Math.floor(100000 + Math.random() * 900000).toString() // 6 碼 OTP

    // ==== 儲存 OTP 到資料庫 ====
    const secretKey = process.env.JWT_SECRET_KEY
    const token = jwt.sign(
      {
        email: email,
        otp: otp,
      },
      secretKey,
      { expiresIn: '1h' }
    )
    let error = ''
    const query = `UPDATE users SET otp='${token}' WHERE email=?`
    await db
      .execute(query, [email])
      .then((data) => data[0][0])
      .catch((err) => {
        error = err.message
      })
    if (error)
      return res.status(400).json({
        status: 'error',
        otp,
        message: '資料庫寫入 OTP 失敗' + error,
      })

    // ==== 寄出電子郵件 ====
    try {
      await sendOTPEmail(email, otp)
      res.json({ status: 'success', token, message: 'OTP 已寄出' })
    } catch (error) {
      console.error(error)
      res
        .status(500)
        .json({ status: 'error', message: '寄送 OTP 失敗' + error.message })
    }
  }
)

const isOpt = async (req, res) => {
  // ==== 解讀存進資料庫的 opt 的 token ====
  const { email, otp } = req.otpMsg
  if (!email || !otp) {
    return res
      .status(400)
      .json({ status: 'error', message: '請提供 Email 和 OTP' })
  }
  const clientOpt = req.body?.otp || 0
  if (parseInt(clientOpt) !== parseInt(otp))
    return res.status(400).json({ status: 'error', msg: '錯誤的 OTP' })
}
// routes/otp.js（接續之前的程式碼）
router.post(
  '/verify-otp',
  verifyOTP,
  [
    body('newPass')
      .isLength({ min: 5, max: 16 })
      .withMessage('密碼長度為5~16字元間'),
    body('againPass').custom((value, { req }) => {
      // ==== 確認密碼是否一致 ====
      if (value != req.body.newPass) {
        throw new Error('密碼不一致')
      }
      if(value.length<5 || value.length>16){
        throw new Error('密碼長度為5~16字元間')
      }
      return true
    }),
    body('optError').custom((value, { req }) => {
      // ==== 解讀存進資料庫的 opt 的 token ====
      const { email, otp } = req.otpMsg
      if (!email || !otp) {
        throw new Error('請提供 Email 和 OTP')
      }
      const clientOpt = req.body?.otp || 0
      if (parseInt(clientOpt) !== parseInt(otp)) throw new Error('錯誤的 OTP')
      return true
    }),
  ],
  validateRequest,
  async (req, res) => {
    // ==== 解讀存進資料庫的 opt 的 token ====
    // const { email, otp } = req.otpMsg
    // if (!email || !otp) {
    //   return res
    //     .status(400)
    //     .json({ status: 'error', message: '請提供 Email 和 OTP' })
    // }
    // const clientOpt = req.body?.otp || 0
    // if (parseInt(clientOpt) !== parseInt(otp))
    //   return res.status(400).json({ status: 'error', msg: '錯誤的 OTP' })

    // const record = otpStore[email]

    // if (!record) {
    //   return res
    //     .status(400)
    //     .json({ status: 'error', message: '找不到此 Email 的 OTP 記錄' })
    // }

    // const isExpired = Date.now() > record.expiresAt
    // const isValid = record.otp === otp

    // if (isExpired) {
    //   delete otpStore[email]
    //   return res
    //     .status(400)
    //     .json({ status: 'error', message: 'OTP 已過期，請重新申請' })
    // }

    // if (!isValid) {
    //   return res.status(400).json({ status: 'error', message: 'OTP 不正確' })
    // }

    // 驗證成功
    // delete otpStore[email] // 一次性使用後即清除

    // ==== 重設密碼 ====
    const { newPass } = req.body
    let error = ''
    try {
      // ---- change passowrd ----
      const { email } = req.otpMsg
      // hash newPass
      const hashed = await bcrypt.hash(newPass, 10)
      console.log('hashed', newPass)

      const query2 = `UPDATE users SET password = ? WHERE email=?`
      const data = await db
        .execute(query2, [hashed, email])
        .then((data) => data[0][0])
        .catch((err) => {
          error = err
        })
      // send user data to client
      console.log(newPass)
      res.json({
        status: 'success',
        data: data,
        message: '密碼更新成功',
      })
    } catch (err) {
      res.json({ status: 'error', message: '更新錯誤', error: error })
    }
    // res.json({ status: 'success', message: 'OTP 驗證成功，請開始重設密碼' })
  }
)

export default router
