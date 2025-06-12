'use client'

import styles from '../../../app/cart/_component/shipping-form/shipping-form.module.scss'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import StepProgress from '../_component/step-progress/step-progress'
import OrderSummary from '../_component/order-summary/order-summary'
import MobileOrderBar from '../_component/mobile-order-bar/mobile-order-bar'
import ShippingForm from '../_component/shipping-form/shipping-form'
//hook
import useIsMobile from '../hook/useIsMobile'
import { useCartContext } from '../context/cart-context'
import { useAuth } from '../../../hook/use-auth'
import cartApi from '../utils/axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PaymentPage() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const { orderData, setOrderData, setCartItems } = useCartContext()
  const { user } = useAuth()

  const defaultMemberInfo = {
    recipientName: '',
    recipientPhone: '',
    recipientAdress: '',
  }
  const [memberSameInfo, setMemberSameInfo] = useState(defaultMemberInfo)
  const [paymentMethod, setPaymentMethod] = useState('信用卡')

  // 用來接收從 ShippingForm 傳來的配送資料
  const [shippingInfo, setShippingInfo] = useState({
    shippingMethod: '',
    recipientName: '',
    recipientPhone: '',
    recipientAddress: '',
    pickupStoreName: '',
    pickupStoreAddress: '',
  })

  // 勾選自動帶入會員資料
  const handleCopyMemberInfo = (checked) => {
    if (checked) {
      setMemberSameInfo({
        recipientName: user.name || '',
        recipientPhone: user.tel || '',
        recipientAdress: user.address || '',
      })
    } else {
      setMemberSameInfo(defaultMemberInfo)
    }
  }

  useEffect(() => {
    if (!orderData) {
      const saved = localStorage.getItem('orderSummary')
      if (saved) {
        setOrderData(JSON.parse(saved))
      }
    }
  }, [orderData, setOrderData])

  // 綠界付款流程
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    console.log('🧾 結帳流程開始')
    console.log('付款方式:', paymentMethod)
    console.log('配送方式:', shippingInfo.shippingMethod)

    const cartItems = orderData?.cartItems || []

    if (cartItems.length === 0) {
      toast.error('購物車是空的喔！')
      return
    }

    // 驗證收件資料
    if (shippingInfo.shippingMethod === '宅配') {
      if (
        !shippingInfo.recipientName ||
        !shippingInfo.recipientPhone ||
        !shippingInfo.recipientAddress
      ) {
        toast.error('請填寫完整宅配收件人資料')
        return
      }
    } else if (shippingInfo.shippingMethod === '超商取貨') {
      if (!shippingInfo.pickupStoreName || !shippingInfo.pickupStoreAddress) {
        toast.error('請選擇超商門市')
        return
      }
    }

    setIsLoading(true)

    try {
      // 組裝優惠券資料
      const selecProdCoup = orderData?.selecProdCoup || null
      const selecCourCoup = orderData?.selecCourCoup || null
      const selecGloCoup = orderData?.selecGloCoup || null

      // 計算金額
      const makeupItems = cartItems.filter(
        (item) => item.item_type === 'product'
      )
      const courseItems = cartItems.filter(
        (item) => item.item_type === 'course' || item.item_type === 'experience'
      )

      const totalByCategory = (items) =>
        items.reduce((sum, item) => {
          const price = parseInt(item.sale_price ?? item.base_price)
          return sum + price * item.quantity
        }, 0)

      const makeupTotal = totalByCategory(makeupItems)
      const courseTotal = totalByCategory(courseItems)
      const subtotal = makeupTotal + courseTotal + 200 // 運費

      const getDiscount = (coupon, base) => {
        if (!coupon) return 0
        if (coupon.discount_rate && Number(coupon.discount_rate) < 1) {
          return Math.round(base * (1 - Number(coupon.discount_rate)))
        }
        if (coupon.amount && Number(coupon.amount) > 0) {
          return Number(coupon.amount)
        }
        return 0
      }

      const makeupDiscount = getDiscount(selecProdCoup, makeupTotal)
      const courseDiscount = getDiscount(selecCourCoup, courseTotal)
      const globalDiscount =
        selecGloCoup?.free === 1 ? 200 : Number(selecGloCoup?.amount || 0)

      const finalTotal =
        subtotal - makeupDiscount - courseDiscount - globalDiscount

      // 建立訂單送進資料庫
      const res = await cartApi.post('/order/create', {
        cartItems,
        discountTotal: makeupDiscount + courseDiscount + globalDiscount,
        selecProdCoup,
        selecCourCoup,
        selecGloCoup,
        paymentMethod,
        shippingMethod: shippingInfo.shippingMethod,
        shippingAddress: shippingInfo.recipientAddress,
        recipientName: shippingInfo.recipientName,
        recipientPhone: shippingInfo.recipientPhone,
        pickupStoreName: shippingInfo.pickupStoreName,
        pickupStoreAddress: shippingInfo.pickupStoreAddress,
      })

      const { orderId, orderNumber } = res.data
      if (!orderNumber) {
        toast.error('訂單建立失敗，無法取得訂單編號')
        return
      }

      // 更新優惠券狀態 state = 2
      if (selecProdCoup || selecCourCoup || selecGloCoup) {
        await cartApi.post('/coupon/products/use', {
          user_id: user.id,
          order_id: orderId,
        })
      }

      // 更新購物車：移除已結帳商品，保留未結帳的
      const allItems = JSON.parse(localStorage.getItem('cartItems')) || []
      const purchasedIds = cartItems.map((item) => item.id)
      const remaining = allItems.filter(
        (item) => !purchasedIds.includes(item.id)
      )

      // 呼叫後端清空購物車
      await cartApi.post('/cart-items/clear')
      // 重建前端購物車資料
      setCartItems(remaining)
      localStorage.setItem('cartItems', JSON.stringify(remaining))

      // 存訂單編號
      localStorage.setItem('lastOrderNumber', orderNumber)

      // 如果是綠界才導轉跳
      if (paymentMethod === '信用卡') {
        const items = cartItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
        }))

        const ecpayRes = await cartApi.post('/cart-items/ecpay', {
          amount: finalTotal,
          items,
          orderNumber,
        })

        const html = ecpayRes.data
        const container = document.querySelector('#ecpay-form-container')
        if (!container) {
          toast.error('找不到表單容器')
          return
        }
        container.innerHTML = html
        const form = container.querySelector('form')
        if (form) {
          form.submit()
          toast.success('即將跳轉至綠界付款')
        } else {
          toast.error('綠界表單產生失敗')
        }
      } else if (paymentMethod === '超商付款') {
        toast.success('訂單完成，即將跳轉至完成頁')
        setTimeout(() => {
          router.push('/cart/order-completed')
        }, 1000)
      } else if (paymentMethod === 'LinePay') {
        try {
          const linePayRes = await cartApi.get(
            `/cart-items/line-pay/reserve?amount=${finalTotal}`,
            { withCredentials: true }
          )

          const url = linePayRes.data?.data?.paymentUrl
          if (url) {
            window.location.href = url
          } else {
            toast.error('無法取得 LINE Pay 付款連結')
          }
        } catch (error) {
          console.error('Line pay 錯誤:', error)
          toast.error('LINE Pay 建立付款失敗')
        }
      }
    } catch (error) {
      console.error(error)
      toast.error('發生錯誤，無法導向綠界付款')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div style={{ height: '2rem' }}></div>
      <section className="container text-center text-lg-start">
        <h1 className="text-subtext h2 m-4">購物車</h1>
      </section>
      {/* step-icon */}
      <section className="container d-none d-lg-block mb-4">
        <StepProgress currentStep={2} />
      </section>
      <section className="container-fluid container-lg">
        <div className="row gy-5">
          {/* Left */}
          <div className="col-lg-8 col-12">
            <ShippingForm
              memberSameInfo={memberSameInfo}
              setMemberSameInfo={setMemberSameInfo}
              handleCopyMemberInfo={handleCopyMemberInfo}
              onShippingChange={setShippingInfo}
            />

            {/* 付款方式 */}
            <div className="card-style mb-3 p-4">
              <h5 className="fw-bold mb-5 text-maintext">付款方式</h5>

              {[
                { id: '信用卡', label: '信用卡一次付清' },
                { id: '超商付款', label: '超商取貨付款' },
                { id: 'LinePay', label: 'LINE Pay' },
              ].map((option) => (
                <div className="form-check mb-3" key={option.id}>
                  <input
                    className={`${styles.formCheckInput} form-check-input`}
                    type="radio"
                    name="payment"
                    id={`payment-${option.id}`}
                    value={option.id}
                    checked={paymentMethod === option.id}
                    onChange={() => setPaymentMethod(option.id)}
                  />
                  <label
                    htmlFor={`payment-${option.id}`}
                    className="form-check-label"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          {/* Right*/}
          <div className="col-lg-4 col-12">
            {!isMobile && (
              <OrderSummary
                cartItems={orderData?.cartItems || []}
                selecProdCoup={orderData?.selecProdCoup}
                selecCourCoup={orderData?.selecCourCoup}
                selecGloCoup={orderData?.selecGloCoup}
                setSelecGloCoup={() => {}}
                filterCourCoups={orderData?.filterCourCoups || []}
                filterProdCoups={orderData?.filterProdCoups || []}
                onCheckout={handleCheckout} // ecpay
                isLoading={isLoading}
              />
            )}
          </div>
          {isMobile && (
            <MobileOrderBar
              cartItems={orderData?.cartItems || []}
              checkedItems={orderData?.cartItems?.reduce((acc, item) => {
                acc[item.id] = true
                return acc
              }, {})}
              selecProdCoup={orderData?.selecProdCoup}
              selecCourCoup={orderData?.selecCourCoup}
              selecGloCoup={orderData?.selecGloCoup}
              setSelecGloCoup={() => {}}
              shippingCoupons={orderData?.shippingCoupons || []}
              onCheckout={handleCheckout}
            />
          )}
        </div>
      </section>

      {/* 表單容器 */}
      <div id="ecpay-form-container" style={{ display: 'none' }} />
    </>
  )
}
