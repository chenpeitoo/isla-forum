'use client'

import { useEffect } from 'react'
import React, { useState } from 'react'
import Image from 'next/image'
import LikeButton from '../like-button/like-button'
import './comments-card.css'
import { useAuth } from '@/hook/use-auth'
import { toast } from 'react-toastify'

// ⭐ 星星評分選擇器
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

export default function CommentsCard({
  member_name = '',
  star = 0,
  created = '',
  content = '',
  ava_url = '',
  comment_id = 0,
  member_id = 0,
  likeData = {},
  onToggleLike = () => {},
  onOpenModal = () => {},
  onUpdate = () => {},
  onDelete = () => {},
  highlighted = false,
}) {
  const { user } = useAuth()
  const image = ava_url
    ? `http://localhost:3005/images/member/${ava_url}`
    : 'http://localhost:3005/images/member/default-avatar.jpg'

  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(content)
  const [editStar, setEditStar] = useState(star)
  const [renderedContent, setRenderedContent] = useState(content)
  const [renderedStar, setRenderedStar] = useState(star)

  // ⭐ 關鍵：當 props.content / star 改變時，自動更新內部狀態
  useEffect(() => {
    setRenderedContent(content)
    setRenderedStar(star)
  }, [content, star])

  const handleSave = async () => {
    if (!editContent.trim()) {
      toast.error('請輸入留言內容')
      return
    }

    const token = localStorage.getItem('jwtToken')
    try {
      const res = await fetch(
        `http://localhost:3005/api/course/comments/${comment_id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: editContent, star: editStar }),
        }
      )
      const result = await res.json()
      if (result.status === 'success') {
        toast.success('留言已更新')
        setRenderedContent(editContent)
        setRenderedStar(editStar)
        onUpdate(comment_id, editContent, editStar)
        setIsEditing(false)
      } else {
        toast.error(result.message || '更新失敗')
      }
    } catch (err) {
      toast.error('更新過程出錯')
    }
  }

  const renderStars = (score) => {
    const ratingNum = Number(score)
    const fullStars = Math.floor(ratingNum)
    const halfStar = ratingNum % 1 >= 0.5
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)
    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <i className="bx bxs-star" key={`full-${i}`} />
        ))}
        {halfStar && <i className="bx bxs-star-half" key="half" />}
        {[...Array(emptyStars)].map((_, i) => (
          <i className="bx bx-star" key={`empty-${i}`} />
        ))}
      </>
    )
  }

  return (
    <div className="col">
      <div
        className={`card box5-comment-p comments-card ${highlighted ? 'highlight-animate' : ''}`}
      >
        <div className="card-body">
          {/* 頭像與星等 */}
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="me-3">
                <Image
                  src={image}
                  alt="學員圖片"
                  width={800}
                  height={450}
                  className="img-fluid box5-comment-author"
                />
              </div>
              <div>
                <h5 className="card-title">{member_name}</h5>
                <div className="box5-comment-date">{created.split(' ')[0]}</div>
              </div>
            </div>
            <div className="d-flex justify-content-center box5-comment-star fs-5">
              {isEditing ? (
                <StarSelector value={editStar} onChange={setEditStar} />
              ) : (
                renderStars(renderedStar)
              )}
            </div>
          </div>

          {/* 內容區塊 */}
          {isEditing ? (
            <textarea
              className="form-control my-3"
              rows={4}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
          ) : (
            <p className="card-text my-4 box5-card-text">{renderedContent}</p>
          )}

          {/* 按鈕區塊 */}
          <div className="d-flex justify-content-between box5-comment-like">
            <LikeButton
              commentId={comment_id}
              liked={likeData.liked}
              count={likeData.count}
              onToggle={onToggleLike}
            />

            {/* 若本人才可編輯刪除 */}
            {user?.id === member_id && (
              <div className="d-flex gap-2">
                {isEditing ? (
                  <>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setIsEditing(false)}
                    >
                      取消
                    </button>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={handleSave}
                    >
                      儲存
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => {
                        setIsEditing(true)
                        setEditContent(renderedContent)
                        setEditStar(renderedStar)
                      }}
                    >
                      編輯
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => onDelete(comment_id)}
                    >
                      刪除
                    </button>
                  </>
                )}
              </div>
            )}

            {!isEditing && (
              <button
                className="btn btn-sm more-comment open-review-modal"
                onClick={onOpenModal}
              >
                查看更多 <i className="bx bx-chevron-down" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
