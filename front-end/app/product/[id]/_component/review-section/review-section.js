import React, { useState, useEffect } from 'react'
import ReviewCard from '../review-card/review_card.js'
import './review-section.css'

const ReviewsSection = ({ reviews = [] }) => {
  const [visibleCount, setVisibleCount] = useState(4)
  const CDN_BASE = 'https://isla-image.chris142852145.workers.dev/'

  const reviewCommentCardFormater = (review) => ({
    userId: review.is_anonymous ? '匿名用戶' : `用戶 ${review.user_id}`,
    nickname: review.nickname,
    userAvatar: `http://localhost:3005/images/member/${review.ava_url}`,
    rating: review.rating,
    comment_text: review.comment_text,
    created_at: review.created_at,
    images: (review.images || []).map((img) => `${CDN_BASE}${img}`),
    color_name: review.color?.color_name || '未指定',
    color_code: review.color?.color_code || 'null',
  })

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 4)
  }

  const visibleReviews = reviews.slice(0, visibleCount)

  return (
    <div className="reviews-section">
      <div className="reviews-grid">
        {visibleReviews.map((review) => (
          <ReviewCard
            key={review.review_id}
            review={reviewCommentCardFormater(review)}
          />
        ))}
      </div>

      {visibleCount < reviews.length && (
        <div className="text-center mt-4">
          <button className="btn btn-more-cards-show" onClick={handleShowMore}>
            查看更多評論
          </button>
        </div>
      )}
    </div>
  )
}

export default ReviewsSection
