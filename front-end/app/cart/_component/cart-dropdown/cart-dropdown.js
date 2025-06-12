'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'

export default function CartDropdown({ totalCount, cartItems, onCartClick }) {
  const [isOpen, setIsOpen] = useState(false)
  const timerRef = useRef(null)

  const handleMouseEnter = () => {
    clearTimeout(timerRef.current)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setIsOpen(false), 120)
  }
  console.log('totalCount:', totalCount)

  return (
    <div
      className="cart-dropdown-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {/* cart-icon + 數量 */}
      <button
        className="cart-icon"
        type="button"
        onClick={onCartClick}
        style={{ position: 'relative' }}
      >
        <Image
          src="/header/Elements/Navigation/outline/shoppingbag.svg"
          alt="購物袋"
          width={34}
          height={34}
        />
        <div className="cart-badge">{totalCount}</div>
      </button>
      {/* Dropdown */}
      {isOpen && (
        <div className="cart-dropdown">
          <div className="cart-dropdown-arrow"></div>
          <div className="cart-dropdown-title">最近加入的商品</div>
          <ul className="cart-dropdown-list">
            {totalCount === 0 ? (
              <li className="text-muted">目前購物車沒有商品</li>
            ) : (
              cartItems.map((item) => (
                <li key={item.id} className="cart-dropdown-item">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    width={40}
                    height={40}
                  />
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">
                    $NT
                    {Number(
                      item.sale_price ?? item.base_price
                    ).toLocaleString()}
                  </span>
                </li>
              ))
            )}
          </ul>
          <button className="cart-dropdown-btn" onClick={onCartClick}>
            查看我的購物車
          </button>
        </div>
      )}
    </div>
  )
}
