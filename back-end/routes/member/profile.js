import express from 'express'
const router = express.Router()
import {
  validateName,
  validateNickName,
  validateAddress,
  validateTel,
  validateSkin,
  validateRequest,
} from '../../middlewares/express-valid-member.js'
import db from '../../config/mysql.js'
import verifyToken from '../../lib/verify-token.js' // token verification

const validation = [
  validateName,
  validateNickName,
  validateAddress,
  validateSkin,
  validateTel,
]

const profileInfo =
  'name,nickname,birthday,gender,tel,skin_type,city,area,postcode,address'
/* GET profile page. */
router.get('/', verifyToken, async (req, res) => {
  let error
  const id = req?.user?.id || 0
  try {
    const query = `SELECT ${profileInfo} FROM users WHERE id=?`
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

/* GET profile page. */
router.post('/', verifyToken, validation, validateRequest, async (req, res) => {
  let error
  const id = req?.user?.id || 0
  // 將profileInfo 改寫成符合 UPDATE 語法的形式(updateProfile) && 設定update的新值(解構賦值from req.body)
  const profileArray = profileInfo.split(',').map((v) => `${v}=?`)
  const updateProfile = profileArray.toString()
  console.log(updateProfile)
  const {
    name,
    nickname,
    birthday,
    gender,
    tel,
    skin_type,
    city,
    area,
    postcode,
    address,
  } = req.body
  try {
    const query = `UPDATE users SET ${updateProfile} WHERE id=?`
    const user = await db
      .execute(query, [
        name,
        nickname,
        birthday,
        gender,
        tel,
        skin_type,
        city,
        area,
        postcode,
        address,
        id,
      ])
      .then((data) => data[0][0])
      .catch((err) => {
        error = err
      })
    // send user data to client
    res.json({
      status: 'success',
      data: user,
      message: '修改成功',
    })
  } catch (err) {
    res.json({ status: 'error', message: error })
  }
})

export default router
