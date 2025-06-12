 import express from 'express'
const router = express.Router()
// 導入上傳圖片的函式 vercel blob
import { put, del } from '@vercel/blob'
// 服務層的函式
import {
  getUsers,
  getUserById,
  createUser,
  updateUserProfileById,
  updateUserPasswordById,
  updateUserAvatarById,
  getUserAvatarById,
} from '../services/user.js'
// 導入回應函式
import { successResponse, errorResponse, isDev } from '../lib/utils.js'
// 中介軟體，用來驗證使用者的身份
import authenticate from '../middlewares/authenticate.js'
// 用來處理FormData的中介軟體，上傳檔案用使用multer
import path from 'path'
import multer from 'multer'
import prisma from '../lib/prisma.js'
import db from '../config/mysql.js'

// #region ------ multer ------
//  multer的設定值
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    // 存放目錄
    callback(null, 'public/avatar/')
  },
  filename: function (req, file, callback) {
    // 經授權後，檔名用req.user帶有會員的id
    const newFilename = req.user.id
    // 或是新檔名由表單傳來的req.body.newFilename決定
    //const newFilename = req.query.filename
    callback(null, newFilename + path.extname(file.originalname))
  },
})
const upload = multer({ storage: storage })
// `upload.none()`可用來處理沒有檔案上傳時，要獲取FormData的資料
// #endregion ------------

// #region ------ GET ------
// 得到所有會員資料
// 網址: /api/users
router.get('/', async (req, res) => {
  try {
    const users = await db.query('SELECT * FROM user')

    res.json({ status: 'success', data: users })
  } catch (error) {
    errorResponse(res, error)
  }
})

// 得到單筆資料(透過授權的直接使用JWT token中的id)
// 網址: /api/users/me
router.get('/me', authenticate, async (req, res) => {
  // 取得使用者id，從req.user.id取得(透過JWT解碼)
  const userId = req.user.id
  // 如果是開發環境，顯示訊息
  if (isDev) console.log('userId', userId)

  try {
    // 需要加上await等待取得資料
    const user = await getUserById(userId)
    successResponse(res, { user })
  } catch (error) {
    errorResponse(res, error)
  }
})

// 得到單筆資料(注意，網址有動態參數時要寫在GET區段最後面)
// 網址: /api/users/:id
router.get('/:userId', async (req, res) => {
  // 需要轉換成數字
  const userId = parseInt(req.params.userId)
  console.log(req)

  try {
    const query = 'SELECT * FROM `user` WHERE id = ?'
    const user = await db
      .execute(query, [userId])
      .then((result) => result[0][0])
      .catch((err) => {
        console.log(err)
      })

    res.json({ status: 'success', data: user })
  } catch (error) {
    errorResponse(res, error)
  }
})
// #endregion ------------


// #region ------ POST ------
// 新增會員資料(註冊會員使用)
router.post('/', upload.none(), async (req, res) => {
  // 取得請求的資料
  const memberAuth = req.body
  // 如果是開發環境，顯示訊息
  console.log('member email: ', memberAuth['email'])
  if (isDev) console.log('req.body', req.body)

  try {
    // 使用findUnique方法取得單筆使用者資料
    const user = await prisma.user.findUnique({
      where: {
        email: memberAuth['email'],
        password: memberAuth['password'],
      },
    })

    // user=null，表示無此會員資料
    if (!user) {
      throw new Error('會員資料不存在')
    }
    // 如果是開發環境，顯示訊息
    if (isDev) console.log('user', user)

    // 成功建立會員的回應
    res.json({ status: 'success', data: user })
  } catch (error) {
    errorResponse(res, error)
  }
})
// 上傳個人大頭照
// 網址: /api/users/me/avatar
router.post(
  '/me/avatar',
  // 驗證使用者要放在multer的upload.single('avatar')之前
  authenticate,
  // 這裡面要得到req.user.id，所以放後面
  upload.single('avatar'),
  async (req, res) => {
    // req.file 即上傳來的檔案(avatar檔案)，req.body 其它的文字欄位資料
    // console.log(req.file, req.body)

    if (!req.file) {
      errorResponse(res, { message: '沒有上傳檔案' })
    }

    // 從authenticate中介軟體取得的user資料
    const userId = req.user?.id
    // 從上傳的檔案取得檔名(這會經由multer處理過的檔案名稱，不是上傳的檔名)
    const avatar = req.file?.filename

    try {
      // 需要加上await等待取得資料
      await updateUserAvatarById(userId, avatar)
      // 成功更新會員的回應
      successResponse(res)
    } catch (error) {
      errorResponse(res, error)
    }
  }
)

// 用vercel blob上傳圖片
// 網址: /api/users/me/avatar
router.post(
  '/me/cloud-avatar',
  authenticate,
  multer().single('avatar'),
  async (req, res) => {
    //const filename = req.query.filename
    // 或是新檔名由表單傳來的req.body.newFilename決定
    //const newFilename = req.query.filename
    const ext = path.extname(req.file.originalname)
    const newFilename = req.user.id + ext
    const userId = req.user.id

    try {
      // 先得到之前的avatar檔名
      const currentAvatarUrl = await getUserAvatarById(userId)

      // 上傳圖片
      const blob = await put(newFilename, req.file.buffer, {
        access: 'public',
      })
      // 更新會員的avatar
      await updateUserAvatarById(userId, blob.url)

      // 如果有上一個目前的圖片，刪除在雲端上的圖片
      if (currentAvatarUrl) await del(currentAvatarUrl)
      // 成功更新會員的回應
      successResponse(res, { blob })
    } catch (error) {
      errorResponse(res, error)
    }
  }
)

export default router
