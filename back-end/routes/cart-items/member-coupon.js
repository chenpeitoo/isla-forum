import express from 'express'
import db from '../../config/mysql.js'
import verifyToken from '../../lib/verify-token.js'
const router = express.Router()

// GET http://localhost:3005/api/cart-items/member-coupon
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id
    if (!userId) {
      return res.status(401).json({ status: 'fail', message: '未登入' })
    }
    //撈購物車資料算quantity
    const [cartItems] = await db.execute(
      `
      SELECT 
        ci.product_id,
        p.brand_id,
        p.category_id,
        ci.quantity
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.product_id
      WHERE ci.user_id = ?
      AND ci.product_id IS NOT NULL
      `,
      [userId]
    )
    // 撈使用者領取的優惠券
    const [couReceived] = await db.execute(
      `
      SELECT 
      c.id,
      c.description,
      c.amount,
      c.discount_rate,
      c.free,
      c.min_amount,
      c.min_quantity, 
      c.type_id,
      c.area,
      c.brand_id,
      c.category_id,
      c.course_categories_id

      FROM coupons_user cu
      JOIN coupons c ON cu.coupon_id = c.id
      WHERE cu.user_id = ? AND cu.state = 1
      `,
      [userId]
    )

    const productCoupons = []
    const courseCoupons = []
    const globCoupons = []

    couReceived.forEach((coup) => {
      // 計算符合此張 coupon 的商品總數量
      const relatedItems = cartItems.filter((item) => {
        const matchBrand =
          coup.brand_id === 0 || item.brand_id === coup.brand_id
        const matchCategory =
          coup.category_id === 0 || item.category_id === coup.category_id
        return matchBrand && matchCategory
      })
      const quantity = relatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      )

      // 組裝
      const tag =
        coup.free === 1
          ? '免運券'
          : coup.discount_rate && coup.discount_rate < 1
          ? '折扣券'
          : '滿額券'

      //三元巢狀應用
      const isApplicable = !coup.min_quantity || quantity >= coup.min_quantity
      // const discountNum = Number(coup.discount_rate) * 10
      // const title = isApplicable
      //   ? coup.free === 1
      //     ? '免運'
      //     : coup.discount_rate && coup.discount_rate < 1
      //     ? discountNum % 1 === 0
      //       ? `${discountNum}折`
      //       : `${discountNum.toFixed(1)}折`
      //     : `折$${Number(coup.amount).toFixed(0)}`
      //   : `需滿 ${coup.min_quantity} 件使用`

      function getDiscountTitle(discount_rate) {
        // 只處理小於 1 的情況
        if (discount_rate < 1) {
          // 轉成字串再去掉小數點前面的 0
          // 0.95 → "95折"、0.88 → "88折"、0.9 → "9折"
          let str = String(discount_rate).replace('0.', '')
          // 0.9 要變成 9 折不是 90 折
          if (discount_rate === 0.9) return '9折'
          return `${str}折`
        }
        return ''
      }

      // 使用方式：
      const title = isApplicable
        ? coup.free === 1
          ? '免運'
          : coup.discount_rate && coup.discount_rate < 1
          ? getDiscountTitle(Number(coup.discount_rate))
          : `折$${Number(coup.amount).toFixed(0)}`
        : `需滿 ${coup.min_quantity} 件使用`

      const formatted = {
        id: coup.id,
        title,
        condition:
          coup.min_amount === 0
            ? '不限金額可使用'
            : `滿$${coup.min_amount}可使用`,
        tag,
        amount: coup.amount,
        discount_rate: coup.discount_rate,
        free: coup.free,
        brand_id: coup.brand_id,
        category_id: coup.category_id,
        course_categories_id: coup.course_categories_id,
        area: coup.area,
        is_applicable: isApplicable,
        block_reason: isApplicable
          ? null
          : `指定品牌選購滿 ${coup.min_quantity} 件即可使用`,
        min_amount: coup.min_amount,
        min_quantity: coup.min_quantity,
        description: coup.description,
      }

      // area = 1商品, 2課程, 0全站
      if (coup.area === 1 || coup.area === 0) productCoupons.push(formatted)
      if (coup.area === 2 || coup.area === 0) courseCoupons.push(formatted)
      if (coup.area === 0 && coup.brand_id === 0 && coup.category_id === 0)
        globCoupons.push(formatted)
    })

    return res.json({
      status: 'success',
      data: {
        productCoupons,
        courseCoupons,
        globCoupons,
      },
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'fail', message: '伺服器錯誤' })
  }
})

export default router
