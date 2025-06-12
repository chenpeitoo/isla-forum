'use client'

import PropTypes from 'prop-types'
import './like-button.css'
import { useState } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function LikeButton({ commentId, liked, count, onToggle }) {
  const [likeAnimate, setLikeAnimate] = useState(false)

  const handleClick = () => {
    setLikeAnimate(true)

    // 觸發父元件的切換
    onToggle(commentId)

    // 顯示 toast 訊息
    if (liked) {
      toast.info('已取消喜歡')
    } else {
      toast.success('已送出喜歡')
    }

    setTimeout(() => setLikeAnimate(false), 300)
  }

  return (
    <button
      onClick={handleClick}
      className={`btn-like d-flex align-items-center border-0 bg-transparent ${liked ? 'liked' : ''}`}
      data-liked={liked}
    >
      <span className="like-count">{count}</span>
      <i
        className={`bx ${liked ? 'bxs-like' : 'bx-like'} ms-1 like-icon ${
          likeAnimate ? 'animate-pop' : ''
        }`}
      />
    </button>
  )
}

LikeButton.propTypes = {
  commentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  liked: PropTypes.bool.isRequired,
  count: PropTypes.number.isRequired,
  onToggle: PropTypes.func.isRequired,
}
