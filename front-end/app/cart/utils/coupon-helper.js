// 根據勾選商品，回傳這張券能不能用，以及不能用的理由

export function checkCouponStatus(coupon, selectedItems, totalAmount) {
  // 課程優惠券
  if (coupon.area === 2 && coupon.course_categories_id !== 0) {
    const selectedCourseCategories = selectedItems
      .filter((item) => item.item_type === 'course')
      .map((item) => Number(item.course_categories_id))

    const isCategoryMatch = selectedCourseCategories.includes(
      Number(coupon.course_categories_id)
    )

    if (!isCategoryMatch) {
      return {
        is_applicable: false,
        block_reason: '課程類別不符合',
      }
    }
  }

  // 篩選出與 這張優惠券 條件符合的商品
  const relatedItems = selectedItems.filter((item) => {
    const itemBrand = parseInt(item.brand_id)
    const itemCategory = parseInt(item.category_id)
    const couponBrand = parseInt(coupon.brand_id)
    const couponCategory = parseInt(coupon.category_id)

    const matchBrand = couponBrand === 0 || itemBrand === couponBrand
    const matchCategory =
      couponCategory === 0 || itemCategory === couponCategory

    return matchBrand && matchCategory
  })
  // 只算 符合條件的商品金額
  const relatedTotalAmount = relatedItems.reduce(
    (sum, item) => sum + (item.sale_price ?? item.base_price) * item.quantity,
    0
  )

  if (relatedItems.length === 0) {
    return {
      is_applicable: false,
      block_reason: '購物車中沒有符合條件的商品',
    }
  }
  // min_quantity 不符合
  const totalQuantity = relatedItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  if (coupon.min_quantity && totalQuantity < coupon.min_quantity) {
    return {
      is_applicable: false,
      block_reason: `選購 ${coupon.min_quantity} 件即可使用`,
    }
  }
  // 金額不足
  // console.log('[金額判斷]', {
  //   relatedTotalAmount,
  //   min_amount: coupon.min_amount,
  //   min_amount_type: typeof coupon.min_amount,
  // })
  if (coupon.min_amount && relatedTotalAmount < Number(coupon.min_amount)) {
    return {
      is_applicable: false,
      block_reason: `需滿 $NT${coupon.min_amount} 才可使用`,
    }
  }

  return {
    is_applicable: true,
    block_reason: null,
  }
}

// 篩出全站優惠券
export function filterGlobalCoupons(coupons, selectedItems) {
  return coupons
    .filter((coupon) => {
      // 挑出免運券，brand_id 是 1~6
      const brandId = parseInt(coupon.brand_id)
      return (
        coupon.free === 1 && !isNaN(brandId) && brandId >= 1 && brandId <= 6
      )
    })
    .map((coupon) => {
      const couponBrandId = parseInt(coupon.brand_id)
      const minAmount = Number(coupon.min_amount) || 0

      // 找出購物車中符合品牌條件的商品
      const relatedItems = selectedItems.filter(
        (item) => parseInt(item.brand_id) === couponBrandId
      )

      // 計算符合品牌條件商品的總金額
      const relatedTotalAmount = relatedItems.reduce(
        (sum, item) =>
          sum + Number(item.sale_price ?? item.base_price) * item.quantity,
        0
      )

      // 符合條件判斷
      const isApplicable =
        relatedItems.length > 0 && relatedTotalAmount >= minAmount

      const blockReason = !relatedItems.length
        ? '購物車中沒有符合品牌的商品'
        : relatedTotalAmount < minAmount
          ? `需滿 NT$${minAmount} 才可使用`
          : null

      return {
        ...coupon,
        is_applicable: isApplicable,
        block_reason: isApplicable ? null : blockReason,
      }
    })
}

export const BRAND_MAP = {
  1: 'Unleashia',
  2: "A'Pieu",
  3: 'Cosnori',
  4: 'Muzigae Mansion',
  5: 'Kaja',
  6: 'rom&nd',
}
