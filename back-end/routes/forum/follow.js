import express from 'express'
import multer from 'multer'
import db from '../../config/mysql.js' // 使用mysql
import path from 'path'

const router = express.Router()

router.get('/', async function (req, res) {
  //   const { followID, userID } = req.body
  // const userID = req.query.userID
  const followID = req.query.followID
  const userID = req.query.userID

  const [result] = await db.query(
    `SELECT GROUP_CONCAT(user_id) AS user_ids
    FROM user_follow
    WHERE follow_id = ?
    GROUP BY follow_id
    `,
    [followID]
  )

  const [follows] = await db.query(
    `SELECT uf.follow_id AS follow_id,
    u.nickname AS follow_nick,
    u.ava_url AS follow_img
    FROM user_follow AS uf
    JOIN users AS u ON uf.follow_id = u.id
    WHERE user_id = ?
    `,
    [userID]
  )
  // console.log(follows)

  const user_ids = result[0] ? result[0]?.user_ids.split(',').map(Number) : ''
  return res.json({ status: 'success', data: user_ids, follows })
})

router.post('/get-follow-list', async function (req, res) {
  const { userID, pageName } = req.body
  let limitClause = ''
  if (pageName === 'subNav') {
    limitClause = 'LIMIT 6'
  }
  // console.log('hi', userID)

  const [result] = await db.query(
    `SELECT follow.*,
    u.ava_url AS userImg,
    u.nickname AS userNick
    FROM user_follow AS follow
    JOIN users AS u ON follow.follow_id = u.id
    WHERE user_id = ?
    ORDER BY follow.follow_id
    ${limitClause}`,
    [userID]
  )
  return res.json({ status: 'success', data: result })
})

router.post('/', async function (req, res) {
  const { followID, userID } = req.body

  const [result] = await db.query(
    `INSERT INTO user_follow (user_id, follow_id) VALUES (?, ?)`,
    [userID, followID]
  )

  if (result.affectedRows === 0) {
    return res.json({
      status: 'success',
      data: 'POST',
      message: '已成功追蹤此帳號',
    })
  }

  return res.json({ status: 'success', data: null })
})

router.delete('/', async function (req, res) {
  const { followID, userID } = req.body

  const [result] = await db.query(
    `DELETE FROM user_follow WHERE user_id = ? AND follow_id = ?`,
    [userID, followID]
  )

  if (result.affectedRows === 0) {
    return res.json({
      status: 'success',
      data: 'DELETE',
      message: '已取消追蹤此帳號',
    })
  }

  return res.json({ status: 'success', data: null })
})

export default router
