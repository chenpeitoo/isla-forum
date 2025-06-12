'use client'

import Image from 'next/image'
import { BsTrash } from 'react-icons/bs'
import styles from './Product-card.module.scss'
import { useState } from 'react'

export default function ProductCardCourse({
  id,
  title,
  image,
  salePrice,
  basePrice,
  category,
  course_categories_id,
  onDelete,
  isChecked = false,
  onCheckChange = () => {},
}) {
  return (
    <div className="card border-0">
      <div className="row g-3">
        <div className="col-md-3 d-flex">
          <div className="d-flex justify-content-center align-items-center">
            <input
              className={`${styles.checkboxInput} form-check-input me-3`}
              type="checkbox"
              id={id}
              checked={isChecked}
              onChange={(e) => onCheckChange?.(e.target.checked)}
            />
            <label htmlFor={id}>
              <Image
                src={image}
                className="img-fluid"
                width={130}
                height={130}
                style={{ height: 'auto' }}
                alt="課程圖"
              />
            </label>
          </div>
        </div>

        <div className="col-md-9">
          <div className="card-body d-flex flex-column gap-1 gap-lg-2">
            {/* 商品名稱 + delete-icon */}
            <div className="d-flex justify-content-between align-items-start">
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <h5
                  className={`${styles.ellipsis} card-title fw-normal mb-0`}
                  style={{ maxWidth: '100%' }}
                  title={title}
                >
                  {title}
                </h5>
                {category && (
                  <span className="badge bg-secondary flex-shrink-0">
                    {category}
                  </span>
                )}
              </div>
              <button
                type="button"
                className="btn border-0 p-0"
                onClick={onDelete}
              >
                <BsTrash className="text-subtext fs-5" />
              </button>
            </div>

            {/* 價格與數量 */}
            <div>
              <div className="d-flex justify-content-between align-items-center mt-2">
                <span className="text-muted small">數量：1</span>
                <div className="fs-5">
                  {salePrice !== basePrice ? (
                    <>
                      <del className="me-2 h6 text-subtext">
                        NT${basePrice.toLocaleString()}
                      </del>
                      <strong className="h5 text-maintext">
                        NT${salePrice.toLocaleString()}
                      </strong>
                    </>
                  ) : (
                    <strong className="h5 text-maintext">
                      NT${basePrice.toLocaleString()}
                    </strong>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
