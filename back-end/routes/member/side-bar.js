import express from 'express'
const router = express.Router()
import db from '../../config/mysql.js'
import verifyToken from '../../lib/verify-token.js' // token verification

// api settings

// get: Send data if Auth is ok
router.get('/', verifyToken, async (req, res) => {
  let error = {}
  // if verifyToken works, it would send user's id to req.user.id
  const id = req?.user?.id || 0

  // set query here
  try {
    const query = `SELECT nickname,ava_url,email FROM users WHERE id=?`
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

export default router
