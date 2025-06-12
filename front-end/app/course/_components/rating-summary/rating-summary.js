'use client'

import { useMemo } from 'react'
import './rating-summary.css'

export default function RatingSummary({ reviews = [] }) {
  // ⭐ 平均分數
  const avgStar = useMemo(() => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, cur) => acc + Number(cur.star || 0), 0)
    return (sum / reviews.length).toFixed(1)
  }, [reviews])

  // ⭐ 星等統計
  const starCounts = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    reviews.forEach((r) => {
      const star = Math.round(r.star || 0)
      if (counts[star] !== undefined) counts[star] += 1
    })
    return counts
  }, [reviews])

  const total = reviews.length

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

  const renderBar = (level) => {
    const count = starCounts[level]
    const percentage = total ? Math.round((count / total) * 100) : 0
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        key={level}
      >
        <div className="col-2 text-center box5-comment-star1">{level}星</div>
        <div
          className="progress col-10 text-center"
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{ height: 4 }}
        >
          <div
            className="progress-bar box5-comment-bar"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="d-flex row">
      <div className="col-lg-4 d-none d-lg-block">
        <div className="d-flex justify-content-center align-items-baseline">
          <div className="text-center box5-comment-h1 fw-bold me-2">
            {avgStar}
          </div>
          <div className="text-center box5-comment-p pe-2">/ 5.0</div>
        </div>
        <div className="d-flex justify-content-center box5-comment-star fs-5 pt-2">
          {renderStars(avgStar)}
        </div>
        <div className="d-flex justify-content-center">
          <div className="card-people-course box5-comment-p pt-3">
            {total} 則評價
          </div>
        </div>
      </div>
      <div className="d-lg-none">
        <div className="d-flex align-content-center mb-4">
          <div className="ms-3 me-4 box5-comment-p">
            {avgStar} {renderStars(avgStar)}
          </div>
          <div className="d-flex">
            <div className="card-people-course box5-comment-p">
              {total} 則評價
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-8 col">
        {[5, 4, 3, 2, 1].map((level) => renderBar(level))}
      </div>
    </div>
  )
}
