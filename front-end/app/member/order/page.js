'use client'
import '../_component/_style.css/form.css'
import { useState, useEffect, Suspense } from 'react'
// ==== component ====
import LoadingLottie from '@/app/_components/loading/lottie-loading'
import OrderList from './_component/order-list'

// 將訂單列表內容抽出成獨立組件
function OrderContent() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // ==== 取得訂單 ====
  async function getOrder() {
    try {
      const token = localStorage.getItem('jwtToken')

      const response = await fetch('http://localhost:3005/api/member/order', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      console.log(data)
      if (response.ok) {
        setOrders(data['data'])
      } else {
        console.log('訂單資料表-連線錯誤')
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  console.log('orders', orders)

  useEffect(() => {
    const token = localStorage.getItem('jwtToken') || null
    if (!token) {
      setLoading(false)
      return
    }

    getOrder()
  }, [])

  if (loading) {
    return (
      <div className="loading-container">
        <LoadingLottie />
      </div>
    )
  }

  return (
    <div className="user-content">
      <h3>訂單詳細資料</h3>
      {orders.map((order, i) => {
        return (
          <OrderList
            key={order.id || i} // 建議使用 order.id 作為 key
            order_number={order['order_number']}
            created_at={order['created_at']}
            status={order['status']}
            total_price={order['total_price']}
            shipping_method={order['shipping_method']}
            payment_method={order['payment_method']}
            order_id={order['id']}
          />
        )
      })}
    </div>
  )
}

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <div className="loading-container">
          <LoadingLottie />
        </div>
      }
    >
      <OrderContent />
    </Suspense>
  )
}
