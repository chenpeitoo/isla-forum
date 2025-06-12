import express from 'express'
const router = express.Router()
import db from '../../config/mysql.js'
import verifyToken from '../../lib/verify-token.js' // 🔐 JWT 驗證中介

// ✅ 取得留言列表（支援排序）
router.get('/', async (req, res) => {
  const { course_id, sort = '1' } = req.query

  if (!course_id) {
    return res.status(400).json({ status: 'false', message: '缺少課程 ID' })
  }

  // 排序邏輯
  let orderByClause = 'cc.is_helpful DESC'
  switch (sort) {
    case '2':
      orderByClause = 'cc.star DESC'
      break
    case '3':
      orderByClause = 'cc.star ASC'
      break
    case '4':
      orderByClause = 'cc.created DESC'
      break
    case '5':
      orderByClause = 'cc.created ASC'
      break
  }

  try {
    const [comments] = await db.query(
      `
      SELECT
        cc.id AS comment_id,
        cc.member_id,
        u.name AS member_name,
        u.ava_url,
        cc.star,
        cc.created,
        cc.content,
        cc.picture,
        cc.is_helpful
      FROM courses_comments cc
      LEFT JOIN users u ON cc.member_id = u.id
      WHERE cc.courses_id = ?
      ORDER BY ${orderByClause}
    `,
      [course_id]
    )

    res.json({ status: 'success', data: comments })
  } catch (err) {
    console.error('留言撈取錯誤:', err)
    res.status(500).json({ status: 'false', message: '留言撈取失敗' })
  }
})

// ✅ 新增留言
router.post('/', verifyToken, async (req, res) => {
  const userId = req.user.id
  const { course_id, star, content } = req.body

  if (!course_id || !star || !content) {
    return res.status(400).json({ status: 'false', message: '缺少必要欄位' })
  }

  try {
    const [insertResult] = await db.query(
      `
      INSERT INTO courses_comments (courses_id, member_id, star, content, created)
      VALUES (?, ?, ?, ?, NOW())
    `,
      [course_id, userId, star, content]
    )

    const comment_id = insertResult.insertId

    const [newComment] = await db.query(
      `
      SELECT
        cc.id AS comment_id,
        cc.member_id,
        u.name AS member_name,
        u.ava_url,
        cc.star,
        cc.created,
        cc.content,
        cc.is_helpful
      FROM courses_comments cc
      LEFT JOIN users u ON cc.member_id = u.id
      WHERE cc.id = ?
    `,
      [comment_id]
    )

    res.json({ status: 'success', data: newComment[0] })
  } catch (err) {
    console.error('新增留言錯誤:', err)
    res.status(500).json({ status: 'false', message: '新增留言失敗: ' + err })
  }
})

// ✅ 更新按讚數（is_helpful）+1/-1
router.patch('/', async (req, res) => {
  const { comment_id, is_add } = req.body

  if (!comment_id || typeof is_add === 'undefined') {
    return res.status(400).json({ status: 'false', message: '缺少參數' })
  }

  try {
    await db.query(
      `
      UPDATE courses_comments
      SET is_helpful = is_helpful ${is_add ? '+ 1' : '- 1'}
      WHERE id = ?
    `,
      [comment_id]
    )

    res.json({ status: 'success', message: '已更新 is_helpful' })
  } catch (err) {
    console.error('更新按讚失敗:', err)
    res.status(500).json({ status: 'false', message: '資料庫錯誤' })
  }
})

// ✅ 更新留言內容與星數（只能本人編輯）
router.patch('/:id', verifyToken, async (req, res) => {
  const commentId = req.params.id
  const userId = req.user.id
  const { content, star } = req.body

  if (!content || !star) {
    return res.status(400).json({ status: 'false', message: '缺少必要欄位' })
  }

  const [[comment]] = await db.query(
    'SELECT member_id FROM courses_comments WHERE id = ?',
    [commentId]
  )

  if (!comment || comment.member_id !== userId) {
    return res
      .status(403)
      .json({ status: 'fail', message: '只能編輯自己的留言' })
  }

  try {
    await db.query(
      `
      UPDATE courses_comments
      SET content = ?, star = ?
      WHERE id = ?
    `,
      [content, star, commentId]
    )

    res.json({ status: 'success', message: '留言已更新' })
  } catch (err) {
    console.error('留言更新錯誤:', err)
    res.status(500).json({ status: 'false', message: '留言更新失敗' })
  }
})

// ✅ 刪除留言（只能刪除自己的）
router.delete('/:id', verifyToken, async (req, res) => {
  const commentId = req.params.id
  const userId = req.user.id

  const [[comment]] = await db.query(
    'SELECT member_id FROM courses_comments WHERE id = ?',
    [commentId]
  )

  if (!comment || comment.member_id !== userId) {
    return res
      .status(403)
      .json({ status: 'fail', message: '只能刪除自己的留言' })
  }

  await db.query('DELETE FROM courses_comments WHERE id = ?', [commentId])
  res.json({ status: 'success' })
})

// ✅ 匯出 router
export default router
