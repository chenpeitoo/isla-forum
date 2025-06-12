import express from 'express'
const router = express.Router()
import multer from 'multer'
import db from '../../config/mysql.js'
import verifyToken from '../../lib/verify-token.js' // token verification

// api settings
let newFileName = ''
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/member')
  },
  filename: function (req, file, cb) {
    newFileName = file.fieldname + '-' + Date.now() + '.jpg'
    cb(null, file.fieldname + '-' + Date.now() + '.jpg')
  },
})

const upload = multer({ storage: storage })

// get: Send data if Auth is ok
router.post('/', verifyToken, upload.single('image'), async (req, res) => {
  let error = {}
  // if verifyToken works, it would send user's id to req.user.id
  const id = req?.user?.id || 0

  // 處理圖片上傳
  if (!req.file) {
    return res.status(400).json({ message: '請上傳圖片' })
  }
  // res.json({ message: '圖片上傳成功', filename: req.file.filename })

  // set query here
  try {
    const query = `UPDATE users SET ava_url=? WHERE id=?`
    const user = await db
      .execute(query, [newFileName, id])
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
