import express from 'express'
const router = express.Router()
import db from '../../config/mysql.js'
import jwt from 'jsonwebtoken'
const secretKey = process.env.JWT_SECRET_KEY

router.post('/', async (req, res) => {
  let error = ''
  let message = '' // too much steps, need to check all steps are down
  const { token } = req.body

  try {
    // ==== 向 Google 驗證 Token ====
    const googleResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
    )
    const userData = await googleResponse.json()

    if (userData.error) {
      return res.status(400).json({ error: 'Invalid Google token' })
    }
    // ==== END 向 Google 驗證 Token ====
    // ==== 整合原有ISLA的登入系統 ====
    try {
      const query = `SELECT id,email, password FROM users WHERE email=?`
      let user = await db
        .execute(query, [userData['email']])
        .then((data) => data[0][0])
        .catch((err) => {
          error = err
        })
      if (!user) {
        // ==== 如果使用者沒ISLA帳號，建立一個 ====
        try {
          const query = `INSERT INTO users (email) VALUES (?)`
          await db
            .execute(query, [userData['email']])
            .then((data) => data[0][0])
            .catch((err) => {
              error = err
            })
          // if create fail, return ...
          if (error) {
            return res.json({
              status: 'error',
              message: `新增會員失敗: ${error}`,
            })
          }
          message += '--新增成功--,'
          // ==== END 建立帳號 ====
          // ==== 建立 ISAL 的 token ====
          try {
            const query = `SELECT id,email,password FROM users WHERE email=?`
            user = await db
              .execute(query, [userData['email']])
              .then((data) => data[0][0])
              .catch((err) => {
                error = err
              })
            message += '--搜尋成功--,'
          } catch (err) {
            return res.json({ status: 'error', message: err })
          }
        } catch (err) {
          return res.json({ status: 'error', message: err })
        }
      }
      // ----- END of create -----
      // build token from user
      const islaToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        secretKey,
        { expiresIn: '30d' }
      )
      message += '--token創建成功--'

      // send user data to client
      res.json({
        status: 'success',
        data: {
          token: islaToken,
          tokenGoogle: token,
          id: user.id,
          name: user.name,
        },
        message,
      })
    } catch (err) {
      res.json({ status: 'error', message: error, flag: 'sys err' })
    }

    // 處理使用者資料（可存入資料庫或建立 Session）
    // res.json({ message: 'Login successful', token: token, data: userData })
  } catch (error) {
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
