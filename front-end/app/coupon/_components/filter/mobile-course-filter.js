'use client'
import clsx from 'clsx'
import { BiChevronUp, BiChevronDown } from 'react-icons/bi'
import styles from './mobile-coupon-filter.module.css'
import MobileFilterButtons from '../../../product/_components/mobile-filter-buttons'

export default function MobileCourseFilter({
  isPanelOpen,
  onTogglePanel,
  currentCategory,
  setCurrentCategory,
  categoryOptions = [],
}) {
  return (
    <div className={clsx('col', styles['sidebar-filter-filter'])}>
      {/* 當篩選面板打開時才顯示 */}
      {isPanelOpen && (
        <div className={styles['mobile-filter-panel']}>
          {/* 分類選單區塊 */}
          <div className={styles['sidebar-filter-filter-menu']}>
            <div className={styles['sidebar-filter-filter-label']}>
              課程分類
            </div>
            <MobileFilterButtons
              options={categoryOptions} // 顯示的分類清單
              selected={[currentCategory]} // 當前選中的項目（單選）
              onToggle={(val) =>
                setCurrentCategory(currentCategory === val ? '' : val)
              } // 點擊切換狀態
            />
          </div>
        </div>
      )}

      {/* 展開 / 收起 按鈕 */}
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
