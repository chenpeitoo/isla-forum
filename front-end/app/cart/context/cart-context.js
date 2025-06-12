'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from '../../../hook/use-auth'
import cartApi from '../utils/axios'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [orderData, setOrderData] = useState(null)
  const { user, isAuth } = useAuth()

  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

  const fetchCartItems = () => {
    if (isAuth && user.id) {
      cartApi
        .get('/cart-items')
        .then((res) => {
          setCartItems(res.data?.data?.cartItems || [])
          localStorage.setItem(
            'cartItems',
            JSON.stringify(res.data?.data?.cartItems || [])
          )
        })
        .catch((error) => {
          console.error('抓取購物車失敗：', error)
          setCartItems([])
        })
    } else {
      setCartItems([])
    }
  }

  useEffect(() => {
    fetchCartItems()
  }, [isAuth, user.id])

  // 監聽 cart-updated 事件
  useEffect(() => {
    const handleCartUpdated = () => {
      fetchCartItems()
    }

    window.addEventListener('cart-updated', handleCartUpdated)
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdated)
    }
  }, [isAuth, user.id])

  useEffect(() => {
    if (isAuth && user.id) {
      // 會員登入，抓會員購物車
      cartApi
        .get('/cart-items')
        .then((res) => {
          setCartItems(res.data?.data?.cartItems || [])
          // 若要寫進 localStorage
          localStorage.setItem(
            'cartItems',
            JSON.stringify(res.data?.data?.cartItems || [])
          )
        })
        .catch((error) => {
          console.error('抓取購物車失敗：', error)
          setCartItems([])
        })
    } else {
      setCartItems([])
      // 登出清空購物車
    }
  }, [isAuth, user.id]) // 只要是登入狀態或id變化就執行

  // cartItems 更新存到localstorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cartItems', JSON.stringify(cartItems))
    }
  }, [cartItems])

  return (
    <CartContext.Provider
      value={{ cartItems, setCartItems, totalCount, orderData, setOrderData }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCartContext() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCartContext 必須在 CartProvider 中使用')
  return context
}
