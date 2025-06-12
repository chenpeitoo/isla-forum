'use client'

import React, { useState, createContext, useContext } from 'react'

const FilterContext = createContext()

export function FilterProvider({ children }) {
  // const [tab, setTab] = useState(0)
  const [keyword, setKeyword] = useState('')
  const [productCate, setProductCate] = useState([])
  const [postCate, setPostCate] = useState([])
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
  return (
    <FilterContext.Provider
      value={{
        // tab,
        // setTab,
        productCateItems,
        postCateItems,
        keyword,
        setKeyword,
        productCate,
        setProductCate,
        postCate,
        setPostCate,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  return useContext(FilterContext)
}
