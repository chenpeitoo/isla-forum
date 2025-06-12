'use client'
import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import styles from './_style/desktop-filter-buttons.module.css'

const DesktopFilterButtons = ({
  options,
  selected,
  onToggle,
  renderOption,
}) => {
  return (
    <div className={styles['sidebar-filter-filter-btn-container']}>
      {options.map((option, index) => {
        const isObject = typeof option === 'object' && option !== null
        const optionValue = isObject
          ? option.id || option.brand_id || option.category_id || option.tag_id
          : option
        const optionLabel = isObject ? option.name : option
        const isSelected = selected.includes(optionValue)

        return (
          <div
            key={optionValue || index}
            className={clsx(
              styles['sidebar-filter-filter-btn'],
              isSelected && styles['sidebar-filter-filter-btn-active']
            )}
            onClick={() => onToggle(optionValue)}
          >
            <div className={styles['sidebar-filter-btn-check-box']}>
              <input
                type="checkbox"
                className="form-check-input"
                checked={isSelected}
                readOnly
              />
              {renderOption ? (
                renderOption(option, index)
              ) : (
                <span>{optionLabel}</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

DesktopFilterButtons.propTypes = {
  options: PropTypes.array.isRequired,
  selected: PropTypes.array.isRequired,
  onToggle: PropTypes.func.isRequired,
  renderOption: PropTypes.func,
}

export default DesktopFilterButtons
