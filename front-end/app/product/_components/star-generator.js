import React from 'react'
import PropTypes from 'prop-types'
import { BsStarFill } from 'react-icons/bs'
import './_style/star-generator.css'

const StarRatingItem = ({ star, maxStars }) => {
  return (
    <>
      <div className="star-box">
        {Array.from({ length: maxStars }, (_, i) => (
          <BsStarFill
            key={i}
            className={`sidebar-filter-star ${i < star ? 'sidebar-filter-star-active' : ''}`}
          />
        ))}
      </div>
    </>
  )
}

StarRatingItem.propTypes = {
  star: PropTypes.number.isRequired,
  maxStars: PropTypes.number.isRequired,
}

export default StarRatingItem
