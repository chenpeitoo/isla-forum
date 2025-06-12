'use client' // 👉 指定這是前端執行的元件（Next.js 的 client component）

import { useState } from 'react'
import Image from 'next/image'
import { useAuth } from '@/hook/use-auth' // 自定義 hook，取得登入的使用者資訊
import { USER_AVA_URL } from '@/_route/img-url' // 使用者頭像路徑
import './add-review-form.css' // 匯入樣式
import { toast } from 'react-toastify'

// ✅ 星星評分選擇器元件（可互動）
function StarSelector({ value = 5, onChange = () => {} }) {
  const [hoverValue, setHoverValue] = useState(null)

  const handleMouseMove = (e, num) => {
    const { left, width } = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - left
    const isHalf = x < width / 2
    setHoverValue(isHalf ? num - 0.5 : num)
  }

  const handleClick = (e, num) => {
    const { left, width } = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - left
    const isHalf = x < width / 2
    const selected = isHalf ? num - 0.5 : num
    onChange(selected)
  }

  const displayValue = hoverValue !== null ? hoverValue : value

  return (
    <div
      className="text-warning fs-4 d-flex"
      onMouseLeave={() => setHoverValue(null)}
    >
      {[1, 2, 3, 4, 5].map((num) => {
        const isFull = displayValue >= num
        const isHalf = displayValue >= num - 0.5 && displayValue < num
        const iconClass = isFull
          ? 'bx bxs-star'
          : isHalf
            ? 'bx bxs-star-half'
            : 'bx bx-star'

        return (
          <i
            key={num}
            className={`${iconClass} cursor-pointer`}
            onClick={(e) => handleClick(e, num)}
            onMouseMove={(e) => handleMouseMove(e, num)}
            style={{ marginRight: '4px' }}
          />
        )
      })}
    </div>
  )
}

// 👉 定義 AddReviewForm 元件，接收 courseID（課程 ID）與 onReviewAdded（提交成功後的 callback）
export default function AddReviewForm({ courseID, onReviewAdded }) {
  const { user } = useAuth() // 取得登入的使用者資訊
  const [star, setStar] = useState(5) // 使用者選擇的評價星數，預設為 5
  const [content, setContent] = useState('') // 使用者輸入的評價內容
  const [submitting, setSubmitting] = useState(false) // 是否正在送出中

  // 👉 表單送出處理邏輯
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return alert('請輸入評價內容')
    if (!user) return alert('請先登入')

    setSubmitting(true)
    const token = localStorage.getItem('jwtToken')

    try {
      const res = await fetch(`http://localhost:3005/api/course/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          course_id: courseID,
          star: star,
          content: content,
          
        }),
      })

      if (!res.ok) throw new Error('送出失敗')
      const data = await res.json()
      onReviewAdded(data.data)
      toast.success('評價已成功送出！') // 放在送出成功後
      setContent('')
      setStar(5)
    } catch (err) {
      alert(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // 👉 畫面渲染區塊
  return (
    <form onSubmit={handleSubmit} className="my-5">
      <div className="d-flex justify-content-between">
        {/* 👉 左側：使用者頭像與名稱 */}
        <div className="col d-flex">
          <Image
            src={
              user?.ava_url
                ? USER_AVA_URL + user.ava_url
                : USER_AVA_URL + 'default-avatar.jpg'
            }
            alt="學員圖片"
            width={40}
            height={40}
            className="img-fluid box5-comment-author"
          />
          <h5 className="m-2 my-auto">
            {user?.name || '匿名用戶'} <span>新增一則評價</span>
          </h5>
        </div>

        {/* 👉 右側：星等選擇（使用星星圖示） */}
        <div className="m-2 d-flex align-items-center">
          <label className="form-label me-2 mb-0">星等：</label>
          <StarSelector value={star} onChange={setStar} />
        </div>
      </div>

      {/* 👉 評論內容輸入框 */}
      <div>
        <textarea
          className="form-control my-2"
          placeholder="請輸入你的評價內容..."
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {/* 👉 送出按鈕 */}
      <div className="text-end">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? '送出中...' : '送出評價'}
        </button>
      </div>
    </form>
  )
}
