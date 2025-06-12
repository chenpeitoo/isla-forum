'use client'

import Image from 'next/image'
import { BsTrash } from 'react-icons/bs'
import styles from './Product-card.module.scss'
import QuantityControler from './quantity-controler'
import { useState } from 'react'

export default function ProductCardColorDots({
  id,
  title,
  image,
  basePrice,
  salePrice,
  quantity,
  category,
  colorOptions = [],
  selectedColor = null,
  onColorChange = () => {},
  onDelete = () => {},
  onQuantityChange = () => {},
  isChecked = false,
  onCheckChange = () => {},
}) {
  const [activeColor, setActiveColor] = useState(
    selectedColor || colorOptions[0]?.name
  )

  const handleColorClick = (colorName) => {
    setActiveColor(colorName)
    onColorChange(colorName)

    // 更新 localStorage 裡對應這個 item 的 color
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]')
    const updated = cartItems.map((item) =>
      item.id === id
        ? {
            ...item,
            color: {
              ...item.color,
              name: colorName,
              // color code 也可以從 colorOptions 裡找對應的 code
              code:
                colorOptions.find((c) => c.name === colorName)?.code ||
                item.color?.code,
            },
          }
        : item
    )
    localStorage.setItem('cartItems', JSON.stringify(updated))
    //動態修改金額
  }
  const unitPrice = Number(salePrice ?? basePrice)
  const baseTotal = Number(basePrice) * quantity
  const saleTotal = Number(unitPrice) * quantity
  return (
    <div className="card border-0">
      <div className="row g-3">
        {/* label + img */}
        <div className="col-md-3 flex">
          <div className="d-flex justify-content-start align-items-center">
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
                width={100}
                height={100}
                alt="商品圖"
              />
            </label>
          </div>
        </div>

        {/* product-content */}
        <div className="col-md-9">
          <div className="card-body d-flex flex-column gap-1 gap-lg-2">
            {/* title + trash */}
            <div className="d-flex justify-content-between align-items-start">
              <div className="d-flex d-flex align-items-center gap-2 flex-wrap">
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
                <BsTrash className="text-subtext fs-5 mb-1" />
              </button>
            </div>

            {/* color-dots select */}
            <div className="d-flex gap-2 mt-2">
              {colorOptions.map((color) => (
                <button
                  type="button"
                  key={color.name}
                  className={`${styles.colorDot} ${activeColor === color.name ? styles.active : ''}`}
                  title={color.name}
                  style={
                    color.code
                      ? { backgroundColor: color.code }
                      : { backgroundColor: '#ccc' } // 預設顏色
                  }
                  onClick={() => handleColorClick(color.name)}
                ></button>
              ))}
            </div>

            {/* 數量與價格 */}
            <div className="d-flex justify-content-between align-items-center">
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
  )
}
