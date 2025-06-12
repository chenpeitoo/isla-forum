'use client'
import clsx from 'clsx'
import styles from './mobile-coupon-filter.module.css'
import { BiChevronUp, BiChevronDown } from 'react-icons/bi'
import MobileFilterButtons from '../../../product/_components/mobile-filter-buttons'

export default function MobileCouponFilter({
  isPanelOpen,
  onTogglePanel,
  currentBrand,
  setCurrentBrand,
  productCategory,
  setProductCategory,
  brandOptions,
  categoryOptions,
}) {
  return (
    <div className={clsx('col', styles['sidebar-filter-filter'])}>
      {/* 篩選面板內容 */}
      {isPanelOpen && (
        <div className={styles['mobile-filter-panel']}>
          {/* 品牌 */}
          <div className={styles['sidebar-filter-filter-menu']}>
            <div className={styles['sidebar-filter-filter-label']}>品牌</div>
            <MobileFilterButtons
              options={brandOptions}
              selected={[currentBrand]}
              onToggle={(val) =>
                setCurrentBrand(currentBrand === val ? '' : val)
              }
            />
          </div>

          {/* 分類 */}
          <div className={styles['sidebar-filter-filter-menu']}>
            <div className={styles['sidebar-filter-filter-label']}>分類</div>
            <MobileFilterButtons
              options={categoryOptions}
              selected={[productCategory]}
              onToggle={(val) =>
                setProductCategory(productCategory === val ? '' : val)
              }
            />
          </div>
        </div>
      )}

      {/* 展開/收合按鈕 */}
      <div className={styles['open-panel-btn-container']}>
        <button className={styles['open-panel-btn']} onClick={onTogglePanel}>
          {isPanelOpen ? (
            <>
              <span className={styles['open-panel-btn-active']}>篩選</span>
              <BiChevronDown className={styles['open-panel-btn-icon']} />
            </>
          ) : (
            <>
              <span>篩選</span>
              <BiChevronUp className={styles['open-panel-btn-icon']} />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
