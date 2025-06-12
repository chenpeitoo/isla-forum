//傳入一批優惠券、購物車資料 → 回傳每張券的is_applicable 結果

import { checkCouponStatus } from '../utils/coupon-helper'
import { useEffect, useState } from 'react'

export default function useProcesCoups(
  coupons = [],
  cartItems = [],
  checkedItems = {},
  totalAmount = 0
) {
  const [procesCoups, setProcesCoups] = useState([])

  useEffect(() => {
    const selectedItems = cartItems.filter((item) => checkedItems[item.id])
    console.log(
      '🧾 勾選課程類別：',
      selectedItems
        .filter((i) => i.item_type === 'course')
        .map((i) => i.course_categories_id)
    )
    console.log(
      '🧾 每張課程券：',
      coupons
        .filter((c) => c.area === 2)
        .map((c) => ({
          title: c.title,
          course_categories_id: c.course_categories_id,
        }))
    )

    //
    const selectedTotalAmount = selectedItems.reduce(
      (sum, item) => sum + (item.sale_price ?? item.base_price) * item.quantity,
      0
    )
    const updated = coupons.map((coupon) => {
      const status = checkCouponStatus(
        coupon,
        selectedItems,
        selectedTotalAmount
      )
      return { ...coupon, ...status }
    })

    setProcesCoups(updated)
  }, [coupons, cartItems, checkedItems, totalAmount])

  return procesCoups
}
