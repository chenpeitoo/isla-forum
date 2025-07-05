'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, createContext, useContext, useEffect } from 'react'

const FilterContext = createContext()

export function FilterProvider({ children }) {
  const router = useRouter()

  const [keyword, setKeyword] = useState('')
  const [productCate, setProductCate] = useState([])
  const [postCate, setPostCate] = useState([])
  const [tab, setTab] = useState(1)
  const [params, setParams] = useState(new URLSearchParams())
  // 分類篩選
  const postCateItems = ['分享', '請益', '討論', '試色']
  const productCateItems = [
    '臉頰底妝',
    '眼部彩妝',
    '唇部彩妝',
    '臉頰彩妝',
    '眉部彩妝',
    '睫毛彩妝',
    '臉部保養',
  ]

  useEffect(() => {
    keyword.length > 0
      ? params.set('keyword', keyword)
      : params.delete('keyword')
    productCate.length > 0
      ? params.set('productCate', productCate)
      : params.delete('productCate')
    postCate.length > 0
      ? params.set('postCate', postCate)
      : params.delete('postCate')
    params.set('tab', tab)

    router.push(`http://localhost:3000/forum?${params.toString()}`)
  }, [keyword, productCate, postCate, tab])

  return (
    <FilterContext.Provider
      value={{
        productCateItems,
        postCateItems,
        keyword,
        setKeyword,
        productCate,
        setProductCate,
        postCate,
        setPostCate,
        tab,
        setTab,
        params,
        setParams,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  return useContext(FilterContext)
}
