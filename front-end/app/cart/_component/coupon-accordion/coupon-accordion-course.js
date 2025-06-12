'use client'
import { FaCircleChevronLeft, FaCircleChevronRight } from 'react-icons/fa6'
import styles from './coupon-accordion.module.scss'
import React from 'react'
import { useState, useEffect, useRef } from 'react'

export default function CouponAccordionCourse({ children }) {
  const [isOpen, setIsOpen] = useState(true)
  const collapseRef = useRef(null)
  const swiperRef = useRef(null)

  // 抓取DOM元素 bs.collapse
  useEffect(() => {
    const collapseElem = collapseRef.current

    if (collapseElem?.classList.contains('show')) setIsOpen(true)
    const handleShow = () => setIsOpen(true)
    const handleHide = () => setIsOpen(false)

    collapseElem?.addEventListener('shown.bs.collapse', handleShow)
    collapseElem?.addEventListener('hidden.bs.collapse', handleHide)

    return () => {
      collapseElem?.removeEventListener('shown.bs.collapse', handleShow)
      collapseElem?.removeEventListener('hidden.bs.collapse', handleHide)
    }
  }, [isOpen])
  return (
    <>
      <div className={`accordion mb-3 ${styles.couponShadow}`} id="couponPro">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className={`accordion-button ${styles.accordionButton}`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#coupon-course"
              aria-expanded="false"
              aria-controls="coupon-course"
            >
              <div className="d-flex align-items-center text-white">
                <i className="bi bi-ticket-perforated-fill fs-5 me-2"></i>
                <h6 className="mb-0">課程優惠券</h6>
              </div>
            </button>
          </h2>

          <div
            id="coupon-course"
            className="accordion-collapse collapse "
            data-bs-parent="#couponCourse"
          >
            <div className={`${styles.accordionBody} accordion-body`}>
              <div className="d-flex justify-content-between align-items-center py-3">
                <p className="text-subtext mb-0">可用的優惠券</p>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn p-0 border-0 rounded-circle d-flex align-items-center justify-content-center"
                    onClick={() => swiperRef.current?.slidePrev()}
                  >
                    <FaCircleChevronLeft className="fs-4 text-subtext" />
                  </button>
                  <button
                    type="button"
                    className="btn p-0 border-0 rounded-circle d-flex align-items-center justify-content-center"
                    onClick={() => swiperRef.current?.slideNext()}
                  >
                    <FaCircleChevronRight className="fs-4 text-subtext" />
                  </button>
                </div>
              </div>

              {/*Accordion 展開時再載入swiper */}
              {isOpen && (
                <div className="row row-cols-lg-2 row-cols-1">
                  {' '}
                  {React.cloneElement(children, { swiperRef })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
