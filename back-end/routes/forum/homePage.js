import express from 'express'
import db from '../../config/mysql.js' // 使用mysql

const router = express.Router()

router.get('/', async function (req, res) {
  // api: https://localhost:3005/api/forum/homePage
  // 資料按讚數排序、取五筆
  // 可取得的屬性：{id, title, content, updated_at, valid, user_id, cate_id, product_cate_id, cate_name, user_nick, user_ava_url, liked_user_ids, likes, saved_user_ids}

  // 你應該只會用到：title, content, likes, comments, user_nick, user_ava_url
  // 還沒有做留言：Ｐ金歹勢
  // forum/_component內有按讚元件可參考

  try {
    const [result] = await db.query(
      `SELECT 
            p.*,
            pc.id AS cate_id,
            pc.name AS cate_name,
            u.nickname AS user_nick,
            u.ava_url AS user_ava_url,
            IFNULL (liked.user_ids, '') AS liked_user_ids,
            IFNULL( liked.likes, 0) + IFNULL( saved.saves, 0) AS popular,
            IFNULL (saved.user_ids, '') AS saved_user_ids
        FROM post p
        JOIN post_category pc ON p.cate_id = pc.id
        JOIN users u ON p.user_id = u.id
        LEFT JOIN (
            SELECT post_id,
            GROUP_CONCAT(user_id) AS user_ids,
            COUNT(user_id) AS likes
            FROM post_user_liked
            GROUP BY post_id
        ) liked ON p.id = liked.post_id
        LEFT JOIN (
            SELECT post_id,
            GROUP_CONCAT(user_id) AS user_ids,
            COUNT(user_id) AS saves
            FROM post_user_saved
            GROUP BY post_id
        ) saved ON p.id = saved.post_id
        ORDER BY popular DESC LIMIT 5`
    )
    return res.json({ status: 'success', data: result })
  } catch (err) {
    console.log(err)
    return res.json({ status: 'error', data: err })
  }
})

export default router
