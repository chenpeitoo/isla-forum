import express from 'express'
const router = express.Router()
import bcrypt from 'bcrypt'
import db from '../../config/mysql.js'
import { body } from 'express-validator'
import { validateRequest } from '../../middlewares/express-valid-member.js'
import verifyToken from '../../lib/verify-token.js' // token verification

// api settings

// get: Send data if Auth is ok
router.post(
  '/',
  verifyToken,
  [
    body('oriPass').custom(async (value, { req }) => {
      // if verifyToken works, it would send user's id to req.user.id
      const id = req?.user?.id || 0
      const { oriPass } = req.body
      const query = `SELECT password FROM users WHERE id=?`
      const user = await db
        .execute(query, [id])
        .then((data) => data[0][0])
        .catch((err) => {
          throw new Error('資料庫連接錯誤' + err.message)
        })
      // if the password is false
      if (!(await bcrypt.compare(oriPass, user.password))) {
        console.log('oriPass Error')
        throw new Error('原密碼錯誤')
      }
      return true
    }),
    body('oriPass')
      .isLength({ min: 5, max: 12 })
      .withMessage('密碼長度為5~16字元間'),
    body('newPass')
      .isLength({ min: 5, max: 12 })
      .withMessage('密碼長度為5~16字元間'),
    body('againPass').custom((value, { req }) => {
      if (value != req.body.newPass) {
        throw new Error('密碼不一致')
      }
      return true
    }),
  ],
  validateRequest,
  async (req, res) => {
    const { newPass } = req.body
    const id = req?.user?.id || 0
    let error = {}
    try {
      // ---- change passowrd ----
      // hash newPass
      const hashed = await bcrypt.hash(newPass, 10)
      console.log('hashed', newPass)

      const query2 = `UPDATE users SET password = ? WHERE id=?`
      const data = await db
        .execute(query2, [hashed, id])
        .then((data) => data[0][0])
        .catch((err) => {
          error = err
        })
      // send user data to client
      res.json({
        status: 'success',
        data: data,
        message: '密碼更新成功',
      })
    } catch (err) {
      res.json({ status: 'error', message: '更新錯誤', error: error })
    }
  }
)

export default router
