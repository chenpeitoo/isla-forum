// ✅ components/review/StarFilterBar.js
'use client'

import React from 'react'
import './review-star-filter-bar.css'

export default function StarFilterBar({
  starCounts = {},
  total = 0,
  selectedStar = null,
  onFilterSelect = () => {},
}) {
  return (
    <div className="">
      {[5, 4, 3, 2, 1].map((level) => {
        const percentage = total
          ? Math.round((starCounts[level] / total) * 100)
          : 0
        const isActive = selectedStar === level

        return (
          <div
            key={level}
            className={`star-filter-item d-flex justify-content-center align-items-center mb-2 ${isActive ? 'active' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => onFilterSelect(level)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onFilterSelect(level)
            }}
          >
            <div className="col-2 text-center box5-comment-star1 ">
              {level}星
            </div>
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
      })}
    </div>
  )
}
