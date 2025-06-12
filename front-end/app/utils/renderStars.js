// ✅ utils/renderStars.js
export function renderStars(score) {
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

// ⭐ 強化功能：加入 star filter 交互邏輯（用於 CourseIDPage）
export function renderFilterableStarBar({
  starCounts,
  total,
  onFilterSelect,
  selectedStar,
}) {
  return [5, 4, 3, 2, 1].map((level) => {
    const percentage = total ? Math.round((starCounts[level] / total) * 100) : 0
    const isActive = selectedStar === level
    return (
      <button
        className={`d-flex justify-content-center align-items-center ${isActive ? 'star-bar-active' : ''}`}
        key={level}
        style={{ cursor: 'pointer' }}
        onClick={() => onFilterSelect(level)}
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
      </button>
    )
  })
}
