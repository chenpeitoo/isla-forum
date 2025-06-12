import express from 'express'
import db from '../../config/mysql.js'
import verifyToken from '../../lib/verify-token.js'

const router = express.Router()

// POST http://localhost:3005/api/order/create
router.post('/', verifyToken, async (req, res) => {
  //要執行多個SQL且要保證它們「全部成功或全部失敗」（orders → order_items → order_coupon），就需要一個獨立連線來控制交易（transaction）
  const connection = await db.getConnection()
  await connection.beginTransaction()
  try {
    const {
      cartItems,
      discountTotal = 0,
      selecProdCoup,
      selecCourCoup,
      selecGloCoup,
      shippingMethod,
      shippingAddress,
      pickupStoreName,
      pickupStoreAddress,
      paymentMethod,
    } = req.body

    const userId = req.user.id
    const orderNumber = `ORD${new Date()
      .toISOString()
      .replace(/\D/g, '')
      .slice(0, 14)}`
    const totalPrice = cartItems.reduce((sum, item) => {
      const price = parseInt(item.sale_price ?? item.base_price) || 0
      return sum + price * item.quantity
    }, 0)

    // 判斷訂單狀態
    let status = 'completed'
    if (paymentMethod === '超商付款') {
      status = 'unpaid'
    }

    // #1 寫入order
    const [orderResult] = await connection.execute(
      `INSERT INTO orders 
        (user_id, order_number, total_price, discount_total, status, payment_method, 
        shipping_method, shipping_address, 
        pickup_store_name, pickup_store_address, 
        created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        userId,
        orderNumber,
        totalPrice,
        discountTotal,
        status,
        paymentMethod,
        shippingMethod,
        shippingAddress ?? null,
        pickupStoreName ?? null,
        pickupStoreAddress ?? null,
      ]
    )

    const orderId = orderResult.insertId

    // #2寫入 order_items
    for (const item of cartItems) {
      const product_id = item.product_id ?? null
      const course_id = item.course_id ?? null
      const experience_id = item.course_experience_id ?? null
      const item_type = item.item_type ?? null
      const price = parseInt(item.sale_price ?? item.base_price) || 0
      // const pickup_store_name = item.pickup_store_name ?? null
      // const pickup_store_address = item.pickup_store_address ?? null

      await connection.execute(
        `INSERT INTO order_items 
          (order_id, product_id, course_id, course_experience_id, quantity, price, item_type)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          product_id,
          course_id,
          experience_id,
          item.quantity,
          price,
          item_type,
        ]
      )
    }

    // #3 寫入 order_coupons
    const usedCoupons = [selecProdCoup, selecCourCoup, selecGloCoup].filter(
      Boolean
    )
    for (const coupon of usedCoupons) {
      await connection.execute(
        `INSERT INTO order_coupons (order_id, coupon_id) VALUES (?, ?)`,
        [orderId, coupon.id]
      )
    }

    await connection.commit()

    // 回傳訂單資訊（讓前端接到後可跳轉至綠界）
    res.json({
      success: true,
      orderId,
      orderNumber,
      totalAmount: totalPrice - discountTotal,
    })
  } catch (err) {
    await connection.rollback()
    console.error(err)
    res.status(500).json({ success: false, message: '建立訂單失敗' })
  } finally {
    connection.release()
  }
})

export default router
