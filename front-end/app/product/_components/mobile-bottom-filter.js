import React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { BsSearch, BsX, BsArrowDown, BsArrowUp } from 'react-icons/bs'
import { BiChevronUp, BiChevronDown } from 'react-icons/bi'
import clsx from 'clsx'
import styles from './_style/mobile-filter.module.css'
console.log(styles)
import MobileFilterButtons from './mobile-filter-buttons.js'

const priceRanges = ['100 ~ 300', '300 ~ 500', '500 ~ 1000', '1000 元以上']

function MobileBottomFilter({
  filters,
  onFilterChange,
  brands,
  categories,
  tags,
  isPanelOpen,
  onTogglePanel,
}) {
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
    onFilterChange({
      sortBy: field,
    })
  }
  const [isIconFlipping, setIsIconFlipping] = useState(false)
  const [isTogglePanelIconAnimating, setIsTogglePanelIconAnimating] =
    useState(false)

  const handleSortOrderToggle = () => {
    onFilterChange({
      sortOrder: sortOrder === 'asc' ? 'desc' : 'asc',
    })
    setIsIconFlipping(true)
  }

  const handleTogglePanelWithAnimation = () => {
    setIsTogglePanelIconAnimating(true)
    if (onTogglePanel) {
      onTogglePanel()
    }
  }

  const toggleSelection = (item, selectedItems, key) => {
    let newSelection = selectedItems.includes(item)
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
      onFilterChange({
        ...filters,
        [key]: newSelection,
      })
    }
  }

  const onKeywordChange = (e) => {
    onFilterChange({
      ...filters,
      keyword: e.target.value,
    })
  }

  const onSaleOnlyToggle = () => {
    onFilterChange({
      onSaleOnly: !onSaleOnly,
    })
  }

  return (
    <div className={clsx('col', styles['sidebar-filter-filter'])}>
      {isPanelOpen && (
        <div className={clsx(styles['mobile-filter-panel'])}>
          <div
            className={clsx(
              styles['sidebar-filter-order-box'],
              'd-flex',
              'flex-column'
            )}
          >
            <div className={clsx(styles['sidebar-filter-order-label'])}>
              排序
            </div>
            <div
              className={clsx(styles['sidebar-filter-order-menu'], 'd-flex')}
            >
              <div
                className={clsx(
                  'col',
                  'd-flex',
                  'justify-content-start',
                  'align-items-center',
                  'w-100'
                )}
              >
                {['final_price', 'average_rating', 'created_at'].map(
                  (field) => (
                    <a
                      href="#"
                      key={field}
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
                      {field === 'final_price' && '價格'}
                      {field === 'average_rating' && '評分'}
                      {field === 'created_at' && '上架日期'}
                    </a>
                  )
                )}
              </div>
              <button
                type="button"
                className={styles['sidebar-filter-order-order']}
                onClick={handleSortOrderToggle}
              >
                <span
                  className={clsx(styles['arrow-icon-flip-animate'], {
                    [styles.flipping]: isIconFlipping,
                  })}
                  onAnimationEnd={() => setIsIconFlipping(false)}
                >
                  {sortOrder === 'asc' ? (
                    <BsArrowUp className={styles.OrderArrow} />
                  ) : (
                    <BsArrowDown className={styles.OrderArrow} />
                  )}
                </span>
              </button>
            </div>
          </div>

          <div
            className={clsx(
              styles['sidebar-filter-main-filter-box'],
              'd-flex',
              'flex-column'
            )}
          >
            <div className={styles['sidebar-filter-filter-menu']}>
              <div
                className={clsx(
                  'form-check',
                  'form-switch',
                  styles['sale-only-switch-container']
                )}
              >
                <input
                  className="form-check-input form-check-input-sale-only"
                  type="checkbox"
                  role="switch"
                  id="switch-sale"
                  checked={onSaleOnly}
                  onChange={onSaleOnlyToggle}
                />
                <label
                  className={clsx(
                    'form-check-label',
                    styles['sidebar-filter-filter-label-sale-only']
                  )}
                  htmlFor="switch-sale"
                >
                  僅顯示特價商品
                </label>
              </div>
            </div>

            <div className={styles['sidebar-filter-filter-menu']}>
              <div className={styles['sidebar-filter-filter-label']}>品牌</div>
              <MobileFilterButtons
                options={brands}
                selected={brandIds}
                onToggle={(item) => toggleSelection(item, brandIds, 'brandIds')}
              />
            </div>

            <div className={styles['sidebar-filter-filter-menu']}>
              <div className={styles['sidebar-filter-filter-label']}>種類</div>
              <MobileFilterButtons
                options={categories}
                selected={categoryIds}
                onToggle={(item) =>
                  toggleSelection(item, categoryIds, 'categoryIds')
                }
              />
            </div>

            {tags && tags.length > 0 && (
              <div className={styles['sidebar-filter-filter-menu']}>
                <div className={styles['sidebar-filter-filter-label']}>
                  標籤
                </div>
                <MobileFilterButtons
                  options={tags}
                  selected={tagIds}
                  onToggle={(item) => toggleSelection(item, tagIds, 'tagIds')}
                />
              </div>
            )}

            <div className={clsx(styles['sidebar-filter-filter-menu'])}>
              <div className={clsx(styles['sidebar-filter-filter-label'])}>
                價格
              </div>
              <div
                className={clsx(styles['sidebar-filter-filter-btn-container'])}
              >
                {priceRanges.map((range) => (
                  <label
                    key={range}
                    className={clsx(styles['sidebar-filter-filter-btn'])}
                  >
                    <input
                      type="checkbox"
                      className={clsx(
                        'form-check-input',
                        styles['form-check-input']
                      )}
                      checked={selectedPriceRangeKeys.includes(range)}
                      onChange={() =>
                        toggleSelection(range, selectedPriceRangeKeys, 'prices')
                      }
                    />
                    <div className={clsx(styles['sidebar-filter-input-label'])}>
                      {range}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles['open-panel-btn-container']}>
        <button
          className={styles['open-panel-btn']}
          onClick={handleTogglePanelWithAnimation}
        >
          {isPanelOpen ? (
            <>
              <span className={styles['open-panel-btn-active']}>篩選</span>
              <span
                className={clsx(styles['arrow-icon-flip-animate'], {
                  [styles.flipping]: isTogglePanelIconAnimating,
                })}
                onAnimationEnd={() => setIsTogglePanelIconAnimating(false)}
              >
                <BiChevronDown
                  className={clsx(
                    styles['open-panel-btn-icon'],
                    styles['open-panel-btn-icon-active']
                  )}
                />
              </span>
            </>
          ) : (
            <>
              <span>篩選</span>
              <span
                className={clsx(styles['arrow-icon-flip-animate'], {
                  [styles.flipping]: isTogglePanelIconAnimating,
                })}
                onAnimationEnd={() => setIsTogglePanelIconAnimating(false)}
              >
                <BiChevronUp className={styles['open-panel-btn-icon']} />
              </span>
            </>
          )}
        </button>
      </div>

      <div className={styles['sidebar-filter-filter-top']}>
        <div className={styles['sidebar-filter-search-box']}>
          <BsSearch
            className={clsx(styles['sidebar-filter-search-icon'], 'd-flex')}
          />
          <div className={clsx(styles['sidebar-filter-search-input'], 'w-100')}>
            <input
              className={clsx('w-100', styles['sidebar-filter-search'])}
              type="text"
              placeholder="你想要找什麼呢？"
              value={keyword}
              onChange={onKeywordChange}
            />
          </div>
          <div className={styles['sidebar-filter-search-x-icon-container']}>
            {keyword && (
              <button
                className={clsx(
                  styles['sidebar-filter-search-x-icon'],
                  'border-0'
                )}
                onClick={() => onFilterChange({ ...filters, keyword: '' })}
              >
                <BsX />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(MobileBottomFilter)
