// 儲存到 localStorage 的功能 這樣切換頁面不會重置
import { useState } from 'react'

export default function useCouponFilter() {
  // coupon type
  const [currentType, setCurrentType] = useState(' ')
  // switch
  const [showClaimed, setShowClaimed] = useState(false)
  // brand
  const [currentBrand, setCurrentBrand] = useState('')
  // product Category
  const [productCategory, setProductCategory] = useState('')
  // course
  const [courseCategory, setcourseCategory] = useState('')

  return {
    currentType,
    setCurrentType,
    showClaimed,
    setShowClaimed,
    currentBrand,
    setCurrentBrand,
    productCategory,
    setProductCategory,
    courseCategory,
    setcourseCategory,
  }
}
