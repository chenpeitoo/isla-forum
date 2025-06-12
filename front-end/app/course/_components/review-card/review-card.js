'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import './review-card.css'
import LikeButton from '../like-button/like-button'
import { USER_AVA_URL } from '@/_route/img-url'
import { useAuth } from '@/hook/use-auth'

export default function ReviewCard({
  member_name = '',
  member_id = 0,
  star = 0,
  created = '',
  content = '',
  ava_url = '',
  comment_id = 0,
  likeData = {},
  onToggleLike = () => {},
  onEdit = () => {},
  onDelete = () => {},
  highlighted = false,
}) {
  const { user } = useAuth()
  const image = ava_url
    ? `http://localhost:3005/images/member/${ava_url}`
    : 'http://localhost:3005/images/member/default-avatar.jpg'

  // ⭐ 新增：讓 star 和 content 可隨 props 更新
  const [displayContent, setDisplayContent] = useState(content)
  const [displayStar, setDisplayStar] = useState(star)

  const renderStars = (score) => {
    const ratingNum = Number(score)
    const fullStars = Math.floor(ratingNum)
    const halfStar = ratingNum % 1 >= 0.5
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)
    console.log('目前登入的 user:', user)
    console.log('這則留言的 member_id:', member_id)
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
    <div
      className={`review-card box5-comment-p ${highlighted ? 'highlight-border' : ''}`}
    >
      <div className="card-body">
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
              <h5 className="card-title ">{member_name}</h5>
              <div>{created.split(' ')[0]}</div>
            </div>
          </div>
          <div className="d-flex justify-content-center box5-comment-star fs-5">
            {renderStars(star)}
          </div>
        </div>
        <p className="card-text my-4">{content}</p>
        <div className="d-flex justify-content-between box5-comment-like">
          <LikeButton
            commentId={comment_id}
            liked={likeData.liked}
            count={likeData.count}
            onToggle={onToggleLike}
          />
          {/* ✅ 如果是本人，就顯示編輯／刪除按鈕 */}
          {user?.id === member_id && (
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => onEdit(comment_id)}
              >
                編輯
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => onDelete(comment_id)}
              >
                刪除
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
