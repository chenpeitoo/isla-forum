// RatingComponent.js
import React from 'react'
import PropTypes from 'prop-types'
import { BiSolidHeart, BiHeart } from 'react-icons/bi'
import './_style/product-bookmark.css'
import Link from 'next/link'

const BookmarkComponent = ({
  isbookmarked = false,
  onToggle,
  isMobile = false,
}) => {
  return (
    <div className="product-card-bookmark">
      <button
          className={'bookmark-btn'}
        onClick={onToggle}
        aria-label={isbookmarked ? '移除書籤' : '加入書籤'}
      >
        {isbookmarked ? (
          <BiSolidHeart
            className={`product-card-bookmark-icon bookmarked  ${isMobile ? 'product-card-bookmark-icon-mobile' : ''} `}
          />
        ) : (
          <BiHeart
            className={` product-card-bookmark-icon ${isMobile ? 'product-card-bookmark-icon-mobile' : ''} `}
          />
        )}
      </button>
    </div>
  )
}

BookmarkComponent.propTypes = {
  isbookmarked: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
}

export default BookmarkComponent
