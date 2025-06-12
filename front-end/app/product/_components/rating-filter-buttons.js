'use client'
import React from 'react'
import PropTypes from 'prop-types'
import SelectableButtonGroup from './desktop-filter-buttons.js'
import StarRatingItem from './star-generator.js'

const RatingFilterButtons = ({ maxStars = 5, selected, onToggle }) => {
  const options = Array.from({ length: maxStars }, (_, i) => i + 1)

  return (
    <SelectableButtonGroup
      options={options}
      selected={selected}
      onToggle={onToggle}
      renderOption={(star) => (
        <StarRatingItem star={star} maxStars={maxStars} />
      )}
    />
  )
}

RatingFilterButtons.propTypes = {
  maxStars: PropTypes.number,
  selected: PropTypes.array.isRequired,
  onToggle: PropTypes.func.isRequired,
}

export default RatingFilterButtons
