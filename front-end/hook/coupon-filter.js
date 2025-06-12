// 儲存到 localStorage 的功能 這樣切換頁面不會重置
import { useState } from 'react'

export default function useCouponFilter(defaultType = '') {
  // coupon type
  const [currentType, setCurrentType] = useState(defaultType)
  // switch
  const [showClaimed, setShowClaimed] = useState(false)
  // brand
  const [currentBrand, setCurrentBrand] = useState('')
  // product Category
  const [productCategory, setProductCategory] = useState('')
  // course
  const [courseCategory, setCourseCategory] = useState('')

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
    setCourseCategory,
  }
}
