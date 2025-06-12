import ReviewsSection from '../review-section/review-section.js'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import clsx from 'clsx'
import './comment-group.css'
import ReviewEditor from '../review-editor/review-editor.js'
import {
  UseSaveOrUpdateReview,
  UseUserReview,
} from '../../../../../hook/use-products.js'
import PictureShowAll from '../show-all-picture/picture-show-all.js'

export function CommentGroup({
  reviews,
  averageRating,
  ratingCounts,
  reviewImages,
  productId,
  userId,
  userName,
  userAvatar,
}) {
  console.log('Reviews', reviews)

  const [sortBy, setSortBy] = useState('date')
  const [fillterRating, setFillterRating] = useState(null)

  const [editReview, setEditReview] = useState(null)
  const [editImages, setEditImages] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  const USER_AVA_URL = 'http://localhost:3005/images/member/'

  const filteredReviews = reviews
    .filter((review) => {
      if (!fillterRating) return true
      return review.rating === fillterRating
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.created_at) - new Date(a.created_at)
      } else {
        return b.rating - a.rating
      }
    })

  const { data, isSuccess, isError, isLoading } = UseUserReview(
    productId,
    userId
  )

  useEffect(() => {
    if (isSuccess) {
      if (data) {
        setEditReview(data.review)
        setEditImages(data.images || [])
      } else {
        setEditReview(null)
        setEditImages([])
      }
      setIsLoaded(true)
    } else if (isError) {
      console.error('請求發生錯誤')
      setEditReview(null)
      setEditImages([])
      setIsLoaded(true)
    }
  }, [isSuccess, isError, data])

  //Hook不能寫在事件處理函式內
  const submitService = UseSaveOrUpdateReview({
    onSuccess: (data) => {
      setEditReview(data.review)
      setEditImages(data.images)
    },
    onError: (error) => {
      alert(error.response?.data?.message || '送出失敗')
    },
  })

  const handleSubmit = async (formData) => {
    submitService.mutate(formData)
  }

  return (
    <div className="comment-component d-flex">
      <div className="comment-sidebar">
        <div className="comment-sidebar-rating d-flex align-items-center gap-3">
          <div className="rating-num">{Number(averageRating).toFixed(1)}</div>
          <div className="rating-starbox d-flex flex-column">
            <div className="star-box">
              {[1, 2, 3, 4, 5].map((i) => (
                <i
                  key={i}
                  className={`bx bxs-star star ${i <= Math.round(averageRating) ? 'star-active' : ''}`}
                />
              ))}
            </div>
            <div className="rating-starbox-status">
              基於 <span className="rating-status">{reviews.length}</span>{' '}
              個評分
            </div>
          </div>
        </div>

        <div className="comment-sidebar-rating-bars flex-column-reverse">
          {[1, 2, 3, 4, 5].map((i) => {
            const barPercent = ((ratingCounts[i] || 0) / reviews.length) * 100
            return (
              <button
                key={i}
                className={clsx(
                  'rating-bar-box d-flex align-items-center',
                  fillterRating === i && 'rating-bar-active'
                )}
                onClick={() => {
                  setFillterRating(fillterRating === i ? null : i)
                }}
              >
                <div className="rating-bar-label">{i} 星</div>
                <div className="rating-bar overflow-hidden">
                  <div
                    className={`rating-bar-${i}`}
                    style={{ width: `${barPercent}%` }}
                  />
                </div>
              </button>
            )
          })}
        </div>
        <PictureShowAll reviewImages={reviewImages} />
      </div>

      <div className="comment-box">
        <div className="tools d-flex align-items-center">
          <div className="tool-box">
            <button
              className={clsx(
                'sort-btn',
                sortBy === 'date' ? 'sort-btn-active' : ''
              )}
              type="button"
              onClick={() => {
                setSortBy('date')
              }}
            >
              最新
            </button>
            <button
              className={clsx(
                'sort-btn',
                sortBy === 'rating' ? 'sort-btn-active' : ''
              )}
              type="button"
              onClick={() => {
                setSortBy('rating')
              }}
            >
              依照星級
            </button>
          </div>
          <div className="tool-box">
            <ReviewEditor
              product_Id={productId}
              user_id={userId}
              edit={editReview}
              editImages={editImages}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
        <ReviewsSection reviews={filteredReviews} />
      </div>
    </div>
  )
}

export default CommentGroup
