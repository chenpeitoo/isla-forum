import express from 'express'
import multer from 'multer'
import db from '../../config/mysql.js' // 使用mysql
import path from 'path'

const router = express.Router()

// 取得第一層留言
router.get('/', async function (req, res) {
  const postID = req.query.postID
  const [data] = await db.query(
    `SELECT c.*,
    u.nickname AS nick,
    u.ava_url AS user_img,
    IFNULL (cliked.user_ids, '') AS user_liked_ids
    FROM comment AS c
    JOIN users AS u ON c.user_id = u.id
    LEFT JOIN (
        SELECT comment_id,
        GROUP_CONCAT(user_id) AS user_ids
        FROM comment_user_liked
        GROUP BY comment_id
    ) cliked ON c.id = cliked.comment_id
    WHERE c.post_id = ? AND c.valid = 1
    ORDER BY c.updated_at ASC
    `,
    [postID]
  )
  //   const [liked] = await db.query(`
  //     SELECT comment_id,
  //     GROUP_CONCAT(user_id) AS user_ids
  //     FROM comment_user_liked
  //     GROUP BY comment_id`)

  return res.json({ status: 'success', data: data })
})

router.post('/', async function (req, res) {
  const { content, userID, postID, parentID } = req.body
  console.log({ content, userID, postID, parentID })
  const [result] = await db.query(
    `INSERT INTO comment (content, user_id, post_id, parent_id) VALUES (?, ?, ?, ?)`,
    [content, userID, postID, parentID]
  )

  if (result.affectedRows === 0) {
    throw new Error('未修改資料')
  }

  return res.json({ status: 'success', data: null })
})

export default router
