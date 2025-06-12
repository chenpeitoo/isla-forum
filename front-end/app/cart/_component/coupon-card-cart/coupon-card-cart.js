// cart/_component/coupon-card-cart.js
import Image from 'next/image'
import { FaCheck } from 'react-icons/fa'
import styles from './coupon-card-cart.module.scss'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'
import { FaExclamationTriangle } from 'react-icons/fa'

import { useState } from 'react'

export default function CouponCardCart({ coupon, onSelect, selected }) {
  const {
    title,
    condition,
    brand_id,
    area,
    course_categories_id,
    category_id,
    is_applicable,
    block_reason,
  } = coupon

  // console.log('card', title, 'is_applicable:', is_applicable)

  const brandMap = {
    1: 'unleashia',
    2: 'apieu',
    3: 'cosnori',
    4: 'muzigae',
    5: 'kaja',
    6: 'rom&nd',
  }
  const courseMap = {
    0: 'isla-class',
    1: 'korean-class',
    2: 'professional-class',
    3: 'daily-class',
    4: 'other-class',
  }

  const prodMap = {
    1: '底妝',
    2: '眼部彩妝',
    3: '唇部彩妝',
    4: '臉頰彩妝',
    5: '眉部彩妝',
    6: '睫毛彩妝',
  }

  const imageKey =
    area === 2 ? courseMap[course_categories_id] : brandMap[brand_id]
  const imageSrc = `/images/coupon/${imageKey}.png`

  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    // if (is_applicable) {
    //   setIsAnimating(true)
    //   onSelect(coupon)
    //   setTimeout(() => setIsAnimating(false), 500) // 結束動畫
    // }
    if (!is_applicable) return

    if (!selected) {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 500)
    }

    onSelect(coupon)
  }

  const cardClass = [
    styles.couponCart,
    selected && styles.selected,
    !is_applicable && styles.disabled,
    isAnimating && styles.tearAnimation,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <div className="position-relative">
        {/* Tooltip-icon*/}
        {!is_applicable && block_reason && (
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tooltip-${coupon.id}`}>
                {brand_id >= 1 && brandMap[brand_id]
                  ? `限定 ${brandMap[brand_id]} 品牌，${block_reason}`
                  : block_reason}
              </Tooltip>
            }
          >
            <div
              className={`${styles.warningIcon} text-warning`}
              style={{ cursor: 'pointer' }}
            >
              <FaExclamationTriangle style={{ fontSize: '32px' }} />
            </div>
          </OverlayTrigger>
        )}

        {/* coupon */}
        <div
          className={`${cardClass} d-flex align-items-center justify-content-between`}
        >
          {/* 品牌圖示 */}
          <div className={styles.brandLogo}>
            <Image src={imageSrc} alt="brand" width={80} height={80} />
          </div>

          {/* 文字 */}
          <div className="ms-4 text-danger">
            <h5 className="m-0 pt-2">{title}</h5>
            <p className="m-0">{condition}</p>
            {area === 1 && category_id !== 0 && (
              <p className="m-0">適用類別：{prodMap[category_id]}</p>
            )}
          </div>

          <div>
            <button
              className={`${styles.circleBtn} ${selected ? styles.active : ''}`}
              disabled={!is_applicable}
              onClick={handleClick}
            >
              {selected && <FaCheck className={styles.checkIcon} />}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
