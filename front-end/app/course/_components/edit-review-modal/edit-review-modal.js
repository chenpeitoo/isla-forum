'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import './edit-review-modal.css'

// ✅ 星星評分選擇器元件
function StarSelector({ value = 5, onChange = () => {} }) {
  const [hoverValue, setHoverValue] = useState(null)

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
            role="button"
            tabIndex={0}
            className={`${iconClass} cursor-pointer`}
            onClick={(e) => handleClick(e, num)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleClick(e, num)
            }}
            onMouseEnter={() => setHoverValue(num)}
            style={{ marginRight: '4px' }}
          />
        )
      })}
    </div>
  )
}

// ✅ 編輯留言 Modal 元件
export default function EditReviewModal({
  isOpen = false,
  onClose = () => {},
  comment = {},
  onUpdate = () => {},
}) {
  const [content, setContent] = useState('')
  const [star, setStar] = useState(5)

  useEffect(() => {
    if (comment) {
      setContent(comment.content || '')
      setStar(comment.star || 5)
    }
  }, [comment])

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error('請輸入留言內容')
      return
    }

    const token = localStorage.getItem('jwtToken')
    try {
      const res = await fetch(
        `http://localhost:3005/api/course/comments/${comment.comment_id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content, star }),
        }
      )

      const result = await res.json()
      if (result.status === 'success') {
        toast.success('留言已更新')
        onUpdate(comment.comment_id, content, star)
        onClose()
      } else {
        toast.error(result.message || '更新失敗')
      }
    } catch (err) {
      console.error('更新失敗:', err)
      toast.error('更新過程出錯')
    }
  }

  if (!isOpen || !comment?.comment_id) return null

  return (
    <>
      <div className="custom-modal" style={{ display: 'flex' }}>
        <div className="custom-modal-content">
          <div className="modal-header">
            <h5 className="window-title">編輯留言</h5>
            <button onClick={onClose} className="btn-close-custom">
              ×
            </button>
          </div>
          <div className="modal-body">
            <textarea
              className="form-control mb-3"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="mb-3">
              <StarSelector value={star} onChange={setStar} />
            </div>
            <div className="d-flex gap-2 justify-content-end">
              <button className="btn btn-secondary" onClick={onClose}>
                取消
              </button>
              <button className="btn btn-success" onClick={handleSubmit}>
                儲存
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal-backdrop show"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onClose()
        }}
      />
    </>
  )
}
