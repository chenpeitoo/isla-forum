import React, { useState } from 'react'
import { BsSearch, BsX, BsArrowDown, BsArrowUp } from 'react-icons/bs'
import clsx from 'clsx'
import styles from './_style/desktop-filter.module.css'
import DesktopFilterButtons from './desktop-filter-buttons.js'
import IslaSwitch from '../../_components/form/switch/form-switch.js'

const priceRanges = ['100 ~ 300', '300 ~ 500', '500 ~ 1000', '1000 元以上']

function SidebarFilter({ filters, onFilterChange, brands, categories, tags }) {
  const {
    keyword = '',
    brandIds = [],
    categoryIds = [],
    tagIds = [],
    minRating = 0,
    maxRating = 5,
    minPrice = 0,
    maxPrice = 9999,
    onSaleOnly = false,
    selectedPriceRangeKeys = [],
    sortBy = '',
    sortOrder = 'ASC',
  } = filters

  const parsePriceRanges = (selectedRanges) => {
    if (!selectedRanges || !selectedRanges.length)
      return { minPrice: 0, maxPrice: 9999 }

    const ranges = selectedRanges.map((range) => {
      if (range.includes('以上')) {
        const min = parseInt(range)
        return { min, max: Infinity }
      } else {
        const [min, max] = range.split('~').map((s) => parseInt(s.trim()))
        return { min, max }
      }
    })

    const minP = Math.min(...ranges.map((r) => r.min))
    const maxP = Math.max(
      ...ranges.map((r) => (r.max === Infinity ? 999999 : r.max))
    )
    return { minPrice: minP, maxPrice: maxP }
  }

  const handleSortFieldChange = (field) => {
    onFilterChange({ sortBy: field })
  }

  const [isIconFlipping, setIsIconFlipping] = useState(false)

  const handleSortOrderToggle = () => {
    const newSortOrder = sortOrder.toLowerCase() === 'asc' ? 'desc' : 'asc'
    onFilterChange({ sortOrder: newSortOrder })
    setIsIconFlipping(true)
  }

  const toggleSelection = (item, selectedItems, key) => {
    const newSelection = selectedItems.includes(item)
      ? selectedItems.filter((i) => i !== item)
      : [...selectedItems, item]

    if (key === 'prices') {
      const { minPrice, maxPrice } = parsePriceRanges(newSelection)
      onFilterChange({
        minPrice,
        maxPrice,
        selectedPriceRangeKeys: newSelection,
      })
    } else {
      onFilterChange({ ...filters, [key]: newSelection })
    }
  }

  const onKeywordChange = (e) => {
    onFilterChange({ ...filters, keyword: e.target.value })
  }

  const onSaleOnlyToggle = () => {
    onFilterChange({ onSaleOnly: !onSaleOnly })
  }

  return (
    <div className={styles['sidebar-filter-filter']}>
      <div className={styles['sidebar-filter-filter-top']}>
        <div
          className={clsx(
            styles['sidebar-filter-search-box'],
            'd-flex justify-content-center align-items-center flex-row w-100 px-3 gap-3'
          )}
        >
          <BsSearch className={styles['sidebar-filter-search-icon-desktop']} />
          <div className={clsx(styles['sidebar-filter-search-input'], 'w-100')}>
            <input
              className={clsx(styles['sidebar-filter-search'], 'w-100')}
              type="text"
              placeholder="你想要找什麼呢？"
              value={keyword}
              onChange={onKeywordChange}
            />
          </div>
          {keyword && (
            <button
              className={clsx(styles['sidebar-filter-search-x-icon'])}
              onClick={() => onFilterChange({ ...filters, keyword: '' })}
            >
              <BsX />
            </button>
          )}
        </div>

        <div
          className={clsx(
            styles['sidebar-filter-order-box'],
            'd-flex flex-column'
          )}
        >
          <div className={styles['sidebar-filter-order-label']}>排序方式</div>
          <div className={clsx(styles['sidebar-filter-order-menu'], 'd-flex')}>
            <div className="col d-flex justify-content-start align-items-center w-100">
              {['final_price', 'average_rating', 'created_at'].map((field) => (
                <a
                  key={field}
                  href="#"
                  className={clsx(
                    styles['sidebar-filter-order-btn'],
                    sortBy === field &&
                      styles['sidebar-filter-order-btn-active']
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    handleSortFieldChange(field)
                  }}
                >
                  {field === 'final_price'
                    ? '價格'
                    : field === 'average_rating'
                      ? '評分'
                      : '上架日期'}
                </a>
              ))}
            </div>
            <button
              type="button"
              className={styles['sidebar-filter-order-order']}
              onClick={handleSortOrderToggle}
            >
              <span
                className={clsx(
                  styles['arrow-icon-flip-animate'],
                  isIconFlipping && styles['flipping']
                )}
                onAnimationEnd={() => setIsIconFlipping(false)}
              >
                {sortOrder.toLowerCase() === 'asc' ? (
                  <BsArrowUp className={styles['order-arrow']} />
                ) : (
                  <BsArrowDown className={styles['order-arrow']} />
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div
        className={clsx(
          styles['sidebar-filter-main-filter-box'],
          'd-flex flex-column'
        )}
      >
        <div className={styles['sidebar-filter-filter-menu']}>
          <div
            className={clsx(
              'form-check',
              'form-switch',
              styles['sidebar-filter-filter-menu-sale']
            )}
          >
            <IslaSwitch
              id="switch-sale"
              checked={onSaleOnly}
              onChange={onSaleOnlyToggle}
            />
            <label
              className={clsx(
                'form-check-label',
                styles['sidebar-filter-filter-label']
              )}
              htmlFor="switch-sale"
            >
              僅顯示特價商品
            </label>
          </div>
        </div>

        <div className={styles['sidebar-filter-filter-menu']}>
          <div className={styles['sidebar-filter-filter-label']}>品牌</div>
          <DesktopFilterButtons
            options={brands}
            selected={brandIds}
            onToggle={(item) => toggleSelection(item, brandIds, 'brandIds')}
          />
        </div>

        <div className={styles['sidebar-filter-filter-menu']}>
          <div className={styles['sidebar-filter-filter-label']}>種類</div>
          <DesktopFilterButtons
            options={categories}
            selected={categoryIds}
            onToggle={(item) =>
              toggleSelection(item, categoryIds, 'categoryIds')
            }
          />
        </div>

        {tags && tags.length > 0 && (
          <div className={styles['sidebar-filter-filter-menu']}>
            <div className={styles['sidebar-filter-filter-label']}>標籤</div>
            <DesktopFilterButtons
              options={tags}
              selected={tagIds}
              onToggle={(item) => toggleSelection(item, tagIds, 'tagIds')}
            />
          </div>
        )}

        <div className={styles['sidebar-filter-filter-menu']}>
          <div className={styles['sidebar-filter-filter-label']}>價格</div>
          <div className={styles['sidebar-filter-filter-btn-container']}>
            {priceRanges.map((range) => (
              <div key={range} className={styles['sidebar-filter-filter-btn']}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedPriceRangeKeys.includes(range)}
                  onChange={() =>
                    toggleSelection(range, selectedPriceRangeKeys, 'prices')
                  }
                />
                <div className={styles['sidebar-filter-input-label']}>
                  {range}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(SidebarFilter)
