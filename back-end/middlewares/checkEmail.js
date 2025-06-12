import db from '../config/mysql.js'
// verify token
const checkEmail = async (req, res, next) => {
  const { email } = req.body

  if (!email)
    return res.status(400).json({ status: 'error', message: '未提供 email' })

  try {
    let error
    const query = `SELECT id,email FROM users WHERE email=?`
    const user = await db
      .execute(query, [email])
      .then((data) => data[0][0])
      .catch((err) => {
        error = err.message
      })
    // if the user doesn't exist
    if (!user)
      return res
        .status(400)
        .json({ status: 'error', message: '查無此會員，' + error })
    // console.log('email驗證成功,',user)
    next()
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: '資料庫驗證email失敗，' + error.message,
    })
  }
}
export default checkEmail
