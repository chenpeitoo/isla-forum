import express from 'express'
import db from '../../config/mysql.js'
import multer from 'multer'

const router = express.Router()
router.post('/add-chat', async (req, res) => {
  const { list, userID } = req.body

  // 找到有user的房間，比對有沒有一樣的，回傳布林值（有的話跳轉、沒的話POST新增聊天室）
  list.push(userID) //若回傳，值會是長度而非陣列
  const listCount = list.length
  const listPlaceholders = list.map(() => '?').join(',')
  const [exsitRoom] = await db.query(
    `
    SELECT room_id
    FROM chat_room_user
    GROUP BY room_id
    HAVING count(*) = ?
    AND SUM(user_id IN (${listPlaceholders})) = ?
    `,
    [listCount, ...list, listCount]
  )
  // console.log({ listCount, listPlaceholders, exsitRoom })

  const isRoomExsit = !!exsitRoom[0]
  let data
  if (!isRoomExsit) {
    const [createRoom] = await db.query(
      `
      INSERT INTO chat_room (fake_name) VALUES (NULL);`
    )

    const newRoomId = createRoom.insertId
    // console.log(newRoomId)
    const newList = list.map((id) => [newRoomId, id])

    const [result] = await db.query(
      `
      INSERT INTO chat_room_user (room_id, user_id)
      VALUES ?`,
      [newList]
    )
    if (result.affectedRows === 0) {
      throw new Error('未成功新增聊天室')
    }
    return res.json({ status: 'success', data: newRoomId })
  } else {
    data = 'exist'
    return res.json({ status: 'success', data })
  }
})

router.get('/', async (req, res) => {
  const userID = req.query.userID
  console.log(userID)
  const [room] = await db.query(
    `SELECT GROUP_CONCAT(room_id) AS room_id
    FROM chat_room_user
    WHERE user_id = ?
    GROUP BY user_id`,
    [userID]
  )
  if (!room) {
    return res.json({ status: 'success', data: null })
  }
  // console.log(room)
  const rooms = room[0]?.room_id?.split(',').map(Number) || []
  const placeHolders = rooms.map(() => '?').join(',') || ''

  if (rooms.length === 0) {
    return res.json({ status: 'success', data: null })
  }

  // console.log(rooms) //string 1,2,3,4,5,6,7,8
  const [roomList] = await db.query(
    `SELECT m.room_id,
    JSON_OBJECT(
      'sender_id', m.sender_id, 
      'content', m.content, 
      'nick', u.nickname, 
      'ava_url', u.ava_url, 
      'created_at', m.created_at
    ) AS msg
    FROM chat_message m
    JOIN (
      SELECT room_id, MAX(created_at) AS latest_at
      FROM chat_message
      WHERE room_id IN (${rooms})
      GROUP BY room_id
    ) AS lm
    ON m.room_id = lm.room_id
    AND m.created_at = lm.latest_at
    JOIN users u ON m.sender_id = u.id
    GROUP BY m.room_id
    ORDER BY m.created_at DESC`
  )

  const [roomHeader] = await db.query(
    `SELECT cru.room_id,
    GROUP_CONCAT(u.nickname) AS nicks,
    GROUP_CONCAT(u.ava_url) AS imgs
    FROM chat_room_user cru
    JOIN users u ON cru.user_id = u.id
    WHERE room_id IN (${placeHolders})
    GROUP BY cru.room_id`,
    rooms
  )

  // for detail
  const roomID = req.query.roomID
  if (roomID) {
    const [messages] = await db.query(`
      SELECT msg.room_id,
      CONCAT(
        '[',
        GROUP_CONCAT(
          JSON_OBJECT(
            'sender_id', msg.sender_id,
            'content', msg.content,
            'nick', u.nickname,
            'ava_url', u.ava_url)
        ),
        ']'
      ) AS msg
      FROM chat_message msg
      JOIN users u ON msg.sender_id = u.id
      WHERE room_id = ${roomID}
      GROUP BY msg.room_id
      ORDER BY msg.created_at`)

    const [roomHeader] = await db.query(
      `SELECT
      GROUP_CONCAT(u.nickname) AS nicks,
      GROUP_CONCAT(u.ava_url) AS imgs
      FROM chat_room_user cru
      JOIN users u ON cru.user_id = u.id
      WHERE room_id = ?`,
      [roomID]
    )

    console.log({ line: 23, userID, room, rooms })
    return res.json({ status: 'success', roomHeader, messages })
  }
  return res.json({ status: 'success', roomList, roomHeader })
})

router.post('/', async (req, res) => {
  const userID = req.body.newMsg.sender_id
  const content = req.body.newMsg.content
  const roomID = req.query.roomID
  // console.log(userID, content, roomID)

  const [result] = await db.query(
    `INSERT INTO chat_message (content, sender_id, room_id) VALUES (?,?,?)`,
    [content, userID, roomID]
  )
  if (result.affectedRows === 0)
    return res.json({ status: 'error', error: '無資料被修改' })
  return res.json({ status: 'success', data: null })
  // return res.json({ status: 'success' })
})

//messages.get('/room', (req, res) => {
//   const roomID = req.query.roomID
// })
export default router
