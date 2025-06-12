'use client'

import styles from './mobile-order-bar.module.scss'
import { useState } from 'react'
import { BRAND_MAP } from '../../utils/coupon-helper'
import LoadingLottie from '../../../_components/loading/lottie-loading'

//價格顯示格式化
function formatCurrency(num) {
  const n = Number(num)
  if (isNaN(n)) return '0'
  return n.toLocaleString('zh-Hant-TW')
}

function getDiscount(coupon, base) {
  if (!coupon) return 0
  if (coupon.discount_rate && Number(coupon.discount_rate) < 1) {
    return Math.round(base * (1 - Number(coupon.discount_rate)))
  }
  if (coupon.amount && Number(coupon.amount) > 0) {
    return Number(coupon.amount)
  }
  return 0
}

export default function MobileOrderBar({
  cartItems = [],
  checkedItems = {},
  selecProdCoup,
  selecCourCoup,
  selecGloCoup,
  setSelecGloCoup,
  shippingCoupons = [],
  onCheckout,
}) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // const [openProdList, setOpenProdList] = useState(false)
  // const [openCourList, setOpenCourList] = useState(false)

  const selectedItems = Array.isArray(cartItems)
    ? cartItems.filter((item) => checkedItems[item.id])
    : []

  const makeupItems = selectedItems.filter(
    (item) => item.item_type === 'product'
  )
  const courseItems = selectedItems.filter(
    (item) => item.item_type === 'course' || item.item_type === 'experience'
  )
  const addOnItems = selectedItems.filter((item) => item.item_type === 'add_on')

  const totalByCategory = (items) =>
    items.reduce((sum, item) => {
      const price = parseInt(item.sale_price ?? item.base_price)
      return sum + price * item.quantity
    }, 0)

  const makeupTotal = totalByCategory(makeupItems)
  const courseTotal = totalByCategory(courseItems)
  const addOnTotal = totalByCategory(addOnItems)

  const shippingBase = 200
  const makeupDiscount = getDiscount(selecProdCoup, makeupTotal)
  const courseDiscount = getDiscount(selecCourCoup, courseTotal)

  let globalDiscount = 0
  let globalCouponTitle = ''
  if (selecGloCoup) {
    if (selecGloCoup.free === 1) {
      globalDiscount = shippingBase
    } else if (selecGloCoup.amount) {
      globalDiscount = Number(selecGloCoup.amount)
    }
    globalCouponTitle = selecGloCoup.title || '全站優惠券'
  }

  const totalDiscount = makeupDiscount + courseDiscount + globalDiscount
  const subtotal = makeupTotal + courseTotal + addOnTotal + shippingBase
  const finalTotal = subtotal - totalDiscount

  const handleCheckout = async () => {
    setIsLoading(true)

    try {
      await onCheckout()
      // router.push 裡面如果已經跳頁，這邊不需要再 setIsLoading(false)
      // 如果沒有跳頁、只是關掉 modal，可以再加一行：
      setIsLoading(false)
    } catch (err) {
      console.error('結帳錯誤：', err)
      setIsLoading(false) // 有錯就顯示錯誤並關掉 loading
    }
  }

  return (
    <>
      {/* 跳轉頁面loading */}
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <LoadingLottie />
        </div>
      )}
      {/* 黑遮罩 */}
      {open && (
        <button
          className={styles.overlay}
          onClick={() => setOpen(false)}
        ></button>
      )}

      {/* 展開明細 */}
      <div className={`${styles.detailPanel} ${open ? styles.show : ''}`}>
        <p className="text-subtext text-center">結帳明細</p>

        <div className={styles.detailBody}>
          {/* 彩妝商品區 */}
          {makeupItems.length > 0 && (
            <>
              <div className="d-flex justify-content-between align-items-center mt-3 mb-2">
                <p>彩妝商品</p>
                <span className="text-maintext">
                  NT${formatCurrency(makeupTotal)}
                </span>
              </div>
              {makeupDiscount > 0 && (
                <div className="d-flex justify-content-between text-secondary mb-2">
                  <p>{selecProdCoup?.description}</p>
                  <p>-NT${formatCurrency(makeupDiscount)}</p>
                </div>
              )}
            </>
          )}

          {/* 彩妝課程區 */}
          {courseItems.length > 0 && (
            <>
              <div className="d-flex justify-content-between align-items-center mt-3 mb-2">
                <p>彩妝課程</p>
                <span className="text-maintext">
                  NT${formatCurrency(courseTotal)}
                </span>
              </div>
              {courseDiscount > 0 && (
                <div className="d-flex justify-content-between text-secondary mb-2">
                  <p>{selecCourCoup?.description}</p>
                  <p>-NT${formatCurrency(courseDiscount)}</p>
                </div>
              )}
            </>
          )}

          {/* 運費 */}
          <div className="d-flex justify-content-between mb-2">
            <p>運費</p>
            <p>NT${formatCurrency(shippingBase)}</p>
          </div>

          {shippingCoupons.length > 0 && (
            <div className="mb-2">
              <select
                className={styles.customSelect}
                value={selecGloCoup?.id || ''}
                onChange={(e) => {
                  const selected = shippingCoupons.find(
                    (c) => c.id === Number(e.target.value)
                  )
                  setSelecGloCoup(selected || null)
                }}
              >
                <option value="">請選擇優惠券</option>
                {shippingCoupons.map((c) => (
                  <option key={c.id} value={c.id} disabled={!c.is_applicable}>
                    {c.title}（{BRAND_MAP[c.brand_id] || '未知品牌'} /
                    {c.is_applicable ? '可用' : c.block_reason}）
                  </option>
                ))}
              </select>
            </div>
          )}

          {globalDiscount > 0 && (
            <div className="d-flex justify-content-between text-secondary mb-2">
              <p>{globalCouponTitle}</p>
              <p>-NT${formatCurrency(globalDiscount)}</p>
            </div>
          )}

          <hr />
          <div className="d-flex justify-content-between fs-5">
            <p>總計</p>
            <p>NT${formatCurrency(finalTotal >= 0 ? finalTotal : 0)}</p>
          </div>
        </div>
      </div>

      {/* 固定底部欄 */}
      <div className={styles.checkoutBar}>
        <div>
          <p className="mb-1 fw-bold">NT${formatCurrency(finalTotal)}</p>
          <button
            className="btn btn-link p-0 text-muted text-decoration-none"
            onClick={() => setOpen(!open)}
          >
            已折 NT${formatCurrency(totalDiscount)} 明細
            <i
              className={`bi ${open ? 'bi-chevron-up' : 'bi-chevron-down'} ms-1`}
            ></i>
          </button>
        </div>

        <button
          className="btn btn-primary rounded-pill px-5"
          onClick={handleCheckout}
          disabled={isLoading}
        >
          結帳
        </button>
      </div>
    </>
  )
}
