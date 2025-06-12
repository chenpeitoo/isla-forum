'use client'

import StepProgress from '../_component/step-progress/step-progress'
import { Accordion, Spinner } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import { useCartContext } from '../context/cart-context'
import Image from 'next/image'
import cartApi from '../utils/axios'
import { useState, useEffect } from 'react'

// 格式化金額
function formatCurrency(num) {
  const n = Number(num)
  if (isNaN(n)) return '0'
  return `NT$${n.toLocaleString('zh-Hant-TW')}`
}

export default function OrderCompletedPage() {
  const { setCartItems } = useCartContext()
  const [orderData, setOrderData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  const [orderNumber, setOrderNumber] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedOrderNumber = localStorage.getItem('lastOrderNumber')
      console.log('從 localStorage 拿到的 orderNumber:', savedOrderNumber)
      setOrderNumber(savedOrderNumber)
    }
  }, [])

  useEffect(() => {
    if (!orderNumber) return // 等待 orderNumber 被 set 之後才開始

    const fetchData = async () => {
      try {
        const res = await cartApi.get(`/order/order-number/${orderNumber}`)
        console.log('成功取得訂單資料:', res.data)
        setOrderData(res.data)
        console.log('嘗試取得訂單資料，orderNumber:', orderNumber)
        setIsLoading(false)
      } catch (err) {
        console.error('取得訂單資料失敗', err)
        setError('找不到訂單資料')
        setIsLoading(false)
      }
    }
    fetchData()

    // 清除 localStorage
    localStorage.removeItem('orderSummary')
    localStorage.removeItem('cartItems')
    setCartItems([])
  }, [orderNumber, setCartItems])

  if (isLoading) {
    return (
      <div className="container text-center mt-5" style={{ height: '300px' }}>
        <Spinner animation="border" />
        <p>載入中...</p>
      </div>
    )
  }

  if (error || !orderData) {
    return (
      <div className="container text-center mt-5">
        <p className="text-danger">{error || '發生未知錯誤'}</p>
      </div>
    )
  }

  const {
    orderId,
    orderDate,
    orderStatus,
    paymentMethod,
    paymentStatus: originalPaymentStatus,
    //把 orderData.paymentStatus取出來，另外取名叫originalPaymentStatus
    recipient,
    shippingMethod,
    products = [],
  } = orderData

  // 根據付款方式決定顯示的付款狀態
  let paymentStatus = '未付款'

  if (paymentMethod !== '超商付款' && orderStatus === 'completed') {
    paymentStatus = '已付款'
  }

  return (
    <>
      <div style={{ height: '2rem' }}></div>
      <section className="container text-center text-lg-start">
        <h1 className="text-subtext h2 m-4">購物車</h1>
      </section>

      <section className="container d-none d-lg-block mb-4">
        <StepProgress currentStep={3} />
      </section>

      <section className="container my-5">
        <div className="card p-5 text-center shadow-sm rounded-4">
          {/* 打勾圖示 */}
          <div className="mb-4">
            <div
              className="bg-success-subtle rounded-circle d-inline-flex justify-content-center align-items-center"
              style={{ width: '120px', height: '120px' }}
            >
              <i className="bi bi-check2 h1"></i>
            </div>
          </div>

          {/* 訂單完成訊息 */}
          <h5 className="fw-bold text-secondary mb-2">已收到你的訂單</h5>
          <p className="text-muted small mb-4">
            訂單編號：<span className="fw-bold">{orderId}</span>
          </p>

          {/* 訂單資訊列 */}
          <div className="row text-center mb-4">
            <div className="col-6 col-md-3 mb-2">
              <div className="fw-bold">訂單日期</div>
              <div className="text-muted">{orderDate}</div>
            </div>
            <div className="col-6 col-md-3 mb-2">
              <div className="fw-bold">訂單狀態</div>
              <div style={{ color: 'green' }}>
                {orderStatus === 'completed' ? '已完成' : '待付款'}
              </div>
            </div>
            <div className="col-6 col-md-3 mb-2">
              <div className="fw-bold">付款方式</div>
              <div className="text-muted">{paymentMethod}</div>
            </div>
            <div className="col-6 col-md-3 mb-2">
              <div className="fw-bold">付款狀態</div>
              <div
                className={
                  paymentStatus === '已付款' ? 'text-success' : 'text-danger'
                }
              >
                {paymentStatus}
              </div>
            </div>
          </div>

          {/* 收件人與商品資訊 Accordion */}
          <Accordion flush className="text-start mb-4">
            <Accordion.Item eventKey="0">
              <Accordion.Header>收件人資訊</Accordion.Header>
              <Accordion.Body style={{ paddingBottom: 0 }}>
                <p>收件人：{recipient.name}</p>
                <p>收件人電話：{recipient.phone}</p>
                {shippingMethod === '宅配' ? (
                  <p>收件地址：{recipient.address}</p>
                ) : (
                  <>
                    <p>取貨門市：{orderData.pickupStoreName || '—'}</p>
                    <p>門市地址：{orderData.pickupStoreAddress || '—'}</p>
                  </>
                )}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>商品</Accordion.Header>
              <Accordion.Body>
                {products.map((item, index) => (
                  <div
                    key={index}
                    className="d-flex align-items-center justify-content-between mb-3"
                  >
                    {/* 左邊：圖片 + 名稱 + 數量 */}
                    <div className="d-flex align-items-center gap-2">
                      <Image
                        src={item.image || '/images/default.jpg'}
                        alt={item.name}
                        width={50}
                        height={50}
                        style={{ objectFit: 'cover' }}
                      />
                      <div>
                        <div
                          className="fw-semibold ms-5"
                          style={{ maxWidth: '100%' }}
                        >
                          {item.name}
                        </div>
                        <div className="text-muted small ms-5">
                          x{item.quantity}
                        </div>
                      </div>
                    </div>

                    {/* 右邊：單價 or 小計 */}
                    <div className="fw-bold text-end">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

          {/* 按鈕 */}
          <div className="d-grid gap-2 d-md-flex justify-content-center">
            <button
              className="btn btn-outline-secondary px-5"
              type="button"
              onClick={() => router.push('/member/order')}
            >
              查看訂單
            </button>
            <button
              className="btn btn-subtext text-white px-5"
              type="button"
              onClick={() => router.push('/')}
            >
              回到首頁
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
