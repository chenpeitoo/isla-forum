'use client'
import React from 'react'
import PropTypes from 'prop-types'
import { BsStarFill, BsStar } from 'react-icons/bs'
import './_style/product-rating.css'

const RatingComponent = ({
  rating,
  reviewCount,
  maxStars = 5,
  reviewTextSuffix = '則評論',
  isMobile = false,
}) => {
  const roundedRating = Math.round(rating)
  const fullStars = roundedRating
  const emptyStars = maxStars - fullStars

  return (
    <div
      className={`rating-component ${isMobile ? 'rating-component-mobile' : ''}`}
    >
      <div className="star-box">
        {Array(fullStars)
          .fill(null)
          .map((_, index) => (
            <BsStarFill key={`full-${index}`} className="star star-active" />
          ))}
        {Array(emptyStars)
          .fill(null)
          .map((_, index) => (
            <BsStar key={`empty-${index}`} className="star" />
          ))}
      </div>
      {/*{reviewCount !== undefined && (*/}
      {/*  <div className="rating_text">*/}
      {/*    {reviewCount} {reviewTextSuffix}*/}
      {/*  </div>*/}
      {/*)}*/}
    </div>
  )
}

RatingComponent.propTypes = {
  rating: PropTypes.number.isRequired,
  reviewCount: PropTypes.number,
  maxStars: PropTypes.number,
  reviewTextSuffix: PropTypes.string,
}

export default RatingComponent
