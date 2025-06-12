import { useEffect, useState } from 'react'

export default function useCartCount() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const syncCartCount = () => {
      const token = localStorage.getItem('jwtToken')
      if (!token) {
        setCount(0)
        return
      }

      const stored = localStorage.getItem('cartItems')
      if (stored) {
        try {
          const items = JSON.parse(stored)
          const total = items.reduce((acc, item) => acc + item.quantity, 0)
          setCount(total)
        } catch (err) {
          console.error('購物車資料解析失敗:', err)
          setCount(0)
        }
      }
    }

    syncCartCount()

    // 跨頁新增購物車
    window.addEventListener('storage', syncCartCount)

    return () => {
      window.removeEventListener('storage', syncCartCount)
    }
  }, [])

  return count
}
