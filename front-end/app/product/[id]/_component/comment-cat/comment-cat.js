'use client'

import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import StarRatingItem from '../../../_components/star-generator'
import styles from './comment_cat.module.css' // 建議抽出 CSS module
import Image from "next/image";

const CommentCat = ({ reviews }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length)
    }, 10000) // 每 10 秒切換

    return () => clearInterval(interval)
  }, [reviews.length])

  if (!reviews || reviews.length === 0) return null

  const currentReview = reviews[currentIndex]

  return (
    <div className={styles['comment-cat']}>
      <div className={styles['cat-card']}>
        <div className={styles['cat-head']}>
          <div className={styles['user-img']}>
            <Image src={'http://localhost:3005/images/member/'+currentReview.ava_url} alt="ava_url" width={40} height={40} />
          </div>
          <div className={styles['cat-head-user']}>
            <div className={styles['username-cat']}>
              {currentReview.nickname}
            </div>
          </div>
          <div className={styles['star-box']}>
            <StarRatingItem star={currentReview.rating} maxStars={5} />
          </div>
        </div>
        <div className={styles['cat-body']}>{currentReview.comment_text}</div>
      </div>
    </div>
  )
}

CommentCat.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      userAvatarSrc: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      commentText: PropTypes.string.isRequired,
    })
  ).isRequired,
}

export default CommentCat
