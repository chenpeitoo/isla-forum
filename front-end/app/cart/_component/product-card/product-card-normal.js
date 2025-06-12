'use client'

import Image from 'next/image'
import { BsTrash } from 'react-icons/bs'
import QuantityControler from './quantity-controler'
import styles from './Product-card.module.scss'
import { useState } from 'react'

export default function ProductCardNormal({
  id,
  title,
  image,
  salePrice,
  basePrice,
  quantity,
  category,
  onDelete,
  onQuantityChange,
  isChecked = false,
  onCheckChange = () => {},
}) {
  // 動態修改金額
  const unitPrice = Number(salePrice ?? basePrice)
  const baseTotal = Number(basePrice) * quantity
  const saleTotal = Number(unitPrice) * quantity
  return (
    <>
      <div className="card border-0 mb-5 d-none d-md-flex">
        <div className="row g-3">
          <div className="col-md-3">
            <div className="d-flex justify-content-start align-items-center ">
              <input
                className={`${styles.checkboxInput} form-check-input`}
                type="checkbox"
                id={id}
                checked={isChecked}
                onChange={(e) => onCheckChange(e.target.checked)}
              />
              <label htmlFor={id}>
                <Image
                  src={image}
                  className="img-fluid ms-3"
                  // style={{ border: '2px solid red', objectFit: 'cover' }}
                  width={100}
                  height={100}
                  alt="商品圖"
                />
              </label>
            </div>
          </div>
          <div className="col-md-9">
            <div className="card-body d-flex flex-column gap-4 gap-lg-2">
              <div className="d-flex justify-content-between">
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
                  className="btn border-0 p-0 mb-4 mb-md-0"
                  onClick={onDelete}
                >
                  <BsTrash className="text-subtext fs-5 mb-1" />
                </button>
              </div>

              {/* 數量與價格 */}
              <div className="d-flex justify-content-between align-items-center mt-lg-3">
                <QuantityControler
                  id={id}
                  value={quantity}
                  onChange={(newQty) => onQuantityChange(newQty)}
                />
                <div className="fs-5">
                  {Number(salePrice) &&
                  Number(salePrice) !== Number(basePrice) ? (
                    <>
                      <del className="me-2 h6 text-subtext">
                        NT${baseTotal.toLocaleString()}
                      </del>
                      <strong className="h5 text-maintext">
                        NT${saleTotal.toLocaleString()}
                      </strong>
                    </>
                  ) : (
                    <strong className="h5 text-maintext">
                      NT${baseTotal.toLocaleString()}
                    </strong>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 手機版*/}
      <div className="container d-md-none">
        {/* checkbox */}
        <input
          className="form-check-input mb-3"
          type="checkbox"
          id={id}
          checked={isChecked}
          onChange={(evt) => onCheckChange(evt.target.checked)}
        />

        <div className="row d-flex align-items-start">
          <div className="col-3 d-flex align-items-start">
            <Image src={image} alt="商品圖" width={70} height={70} />
          </div>
          <div className="col-9 d-flex flex-column gap-1">
            <div className="d-flex justify-content-between">
              <h6 className={`${styles.ellipsis} mb-0`}>{title}</h6>
              <button type="button" className="btn" onClick={onDelete}>
                <BsTrash className="text-subtext fs-6" />
              </button>
            </div>

            {category && (
              <span
                className="badge bg-primary px-2 py-1"
                style={{ width: 'fit-content' }}
              >
                {category}
              </span>
            )}

            <div className="d-flex justify-content-between align-items-center mt-1 px-1">
              <div className="fs-6">NT${saleTotal.toLocaleString()}</div>
              <QuantityControler
                id={id}
                value={quantity}
                onChange={(newQty) => onQuantityChange(newQty)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
