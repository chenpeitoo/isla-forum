'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState, createContext, useContext, useEffect } from 'react'

const FilterContext = createContext()

// 跳轉等工作都交還給filter context 處理（但僅限/forum）
export function FilterProvider({ children }) {
  const router = useRouter()
  const pathname = usePathname()

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
    if (pathname !== '/forum') return //非篩選頁面則不觸發
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

    router.push(`/forum?${params.toString()}`)
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
