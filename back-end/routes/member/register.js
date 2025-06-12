import express from 'express'
import { body } from 'express-validator'
import dayjs from 'dayjs'
import bcrypt from 'bcrypt'
// ==== export functions ====
import db from '../../config/mysql.js'
import {
  validateEmail,
  ValidatePass,
  validateName,
  validateTel,
  validateBirthday,
  validateRequest,
} from '../../middlewares/express-valid-member.js'
// import verifyToken from '../../lib/verify-token.js' // token verification

// ==== express router ====
const router = express.Router()

// ==== notEmpyt Setting ====
const notEmpty = [
  body('email').notEmpty().withMessage('email不可為空'),
  body('password').notEmpty().withMessage('password不可為空'),
  body('name').notEmpty().withMessage('name不可為空'),
  body('birthday').notEmpty().withMessage('birthday不可為空'),
  body('tel').notEmpty().withMessage('tel不可為空'),
]

// ==== express-valid ====
const validation = [
  validateEmail,
  ValidatePass,
  validateName,
  validateTel,
  validateBirthday,
]
// ==== 確認是否為新會員(express validator) ====
const isNew = body('existUser').custom(async (value, { req }) => {
  const { email } = req.body
  const query = 'SELECT email FROM users WHERE email=?'
  const user = await db
    .execute(query, [email])
    .then((data) => data[0][0])
    .catch((err) => {
      throw new Error('資料庫錯誤' + err.message)
    })
  // console.log('user', user)
  if (user) {
    throw new Error('此會員已存在')
  }
  return true
})
// ==== 確認是否為新會員(Google) ====
// const isNewGoogle = async (req, res, next) => {
//   const { email } = req.body
//   const query = 'SELECT email FROM users WHERE email=?'
//   try {
//     const user = await db
//       .execute(query, [email])
//       .then((data) => data[0][0])
//       .catch((err) => {
//         throw new Error('資料庫錯誤' + err.message)
//       })
//     if (user) {
//       throw new Error('此會員已存在')
//     }
//     next()
//   } catch (err) {
//     console.log(err.message)
//   }
// }

// get: Send data if Auth is ok
router.post(
  '/',
  isNew,
  notEmpty,
  validation,
  validateRequest,
  async (req, res) => {
    let error = ''

    // const regiList = 'email, password, name, birthday, tel'
    const newMember = req.body
    // ==== create query string ====
    const queryString = Object.keys(newMember)
      .map((v) => v)
      .toString()
    // ==== create value ? string ====
    const valueString = Object.keys(newMember)
      .map(() => '?')
      .toString()
    // ==== change format of data (password-hash, datatime ISO) ====
    if (newMember['password']) {
      newMember['password'] = await bcrypt.hash(newMember['password'], 10)
    }
    if (newMember['birthday']) {
      newMember['birthday'] = dayjs(newMember['birthday']).format(
        'YYYY-MM-DDTHH:mm:ss'
      )
    }
    // 'YYYY-MM-DDTHH:mm:ssZ[Z]'
    // console.log('isoBirthday: ', isoBirthday)
    console.log(`newMember`, newMember)
    // rearrange object to array (for mysql2 execute)
    const newMemArray = Object.keys(newMember).map((key) => {
      // console.log(key)
      return newMember[`${key}`]
    })
    // res.json({ status: 'test', queryString, valueString, newMemArray })
    // ==== 新增會員 ====
    try {
      const query = `INSERT INTO users (${queryString}) VALUES (${valueString})`
      const newUser = await db
        .execute(query, [...newMemArray])
        .then((data) => data[0][0])
        .catch((err) => {
          error = err
        })
      // if create fail, return ...
      if (error) {
        return res.json({ status: 'error', message: `新增會員失敗: ${error}` })
      }
      // send user data to client
      res.json({
        status: 'success',
        data: newUser,
        message: '新增會員成功',
      })
    } catch (err) {
      res.json({ status: 'error', message: error })
    }
  }
)

// ==== 為google登入者完成註冊資料 ====
router.post(
  '/google',
  notEmpty,
  validation,
  validateRequest,
  async (req, res) => {
    let error = ''

    const newMember = req.body
    // ==== create query string ====
    const queryString = Object.keys(newMember)
      .map((v) => v + '=?')
      .toString()
    // ==== change format of data (password-hash, datatime ISO) ====
    if (newMember['password']) {
      newMember['password'] = await bcrypt.hash(newMember['password'], 10)
    }
    if (newMember['birthday']) {
      newMember['birthday'] = dayjs(newMember['birthday']).format(
        'YYYY-MM-DDTHH:mm:ss'
      )
    }
    // ==== format for mysql2 array ====
    const newMemArray = Object.keys(newMember).map((key) => {
      // console.log(key)
      return newMember[`${key}`]
    })
    // console.log('stringQuery: ', queryString)
    // console.log('newMemArray: ', newMemArray)
    // res.json({ status: 'test', arrayQuery: queryString, arrayData: newMemArray })
    // ==== set query here ====
    try {
      const query = `UPDATE users SET ${queryString} WHERE email=?`
      const newUser = await db
        .execute(query, [...newMemArray, newMember['email']])
        .then((data) => data[0][0])
        .catch((err) => {
          error = err
        })
      // if create fail, return ...
      if (error) {
        return res.json({
          status: 'error',
          message: `新增會員失敗(Google): ${error}`,
        })
      }
      // send user data to client
      res.json({
        status: 'success',
        data: newUser,
        message: '新增會員成功(Google)',
      })
    } catch (err) {
      res.json({ status: 'error', message: error })
    }
  }
)

export default router
