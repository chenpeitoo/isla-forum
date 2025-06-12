import express from 'express'
const router = express.Router()
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
// ==== exported functions ====
import {
  validateEmail,
  ValidatePass,
  validateRequest,
} from '../../middlewares/express-valid-member.js'
import db from '../../config/mysql.js'
import verifyToken from '../../lib/verify-token.js' // token verification
// jwt key
const secretKey = process.env.JWT_SECRET_KEY

// api settings
const validation = [validateEmail, ValidatePass]

// get: Send data if Auth is ok
router.get('/', verifyToken, async (req, res) => {
  let error
  const id = req?.user?.id || 0
  try {
    const query = `SELECT id,name,nickname,email,birthday,point,level,tel,address,ava_url,mem_cpon FROM users WHERE id=?`
    const user = await db
      .execute(query, [id])
      .then((data) => data[0][0])
      .catch((err) => {
        error = err
      })
    // send user data to client
    res.json({
      status: 'success',
      data: user,
      message: '登入成功',
    })
  } catch (err) {
    res.json({ status: 'error', message: error })
  }
})

// post: Send Auth token
router.post('/', validation, validateRequest, async (req, res) => {
  let error
  const { email, password, isAdmin } = req.body
  try {
    const query = `SELECT id,email,password FROM users WHERE email=?`
    const user = await db
      .execute(query, [email])
      .then((data) => data[0][0])
      .catch((err) => {
        error = err
      })
    // if the user doesn't exist
    if (!user) return res.json({ status: 'error', message: '查無此會員' })
    // if the password is false
    if (!(await bcrypt.compare(password, user.password)))
      return res.json({ status: 'error', message: '密碼錯誤' })

    const allowedAdminEmails = ['admin@isla.com']
    if (isAdmin && !allowedAdminEmails.includes(user.email)) {
      return res.json({ status: 'error', message: '你沒有後台管理員登入權限' })
    }
    // if user exist, build token from user
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      secretKey,
      { expiresIn: '30d' }
    )
    console.log('user', user)
    console.log('token', token)

    // send user data to client
    res.json({
      status: 'success',
      data: { token, id: user.id, name: user.name },
      message: '登入成功',
    })
  } catch (err) {
    res.json({ status: 'error', message: '會員資料讀取失敗: ' + error })
  }
})

export default router
