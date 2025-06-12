'use client'

import React, { useState, useEffect } from 'react'
// ==== component ====
import Componentstab from '@/app/_components/tab'
import ForumBar from './_component/forum-bar'
import ProductBar from './_component/product-bar'
// ==== method ====
import getForum from './_method/getForum' // 傳入文章資料的函式 [{},{}]
import getProduct from './_method/getProduct' // 傳入商品資料的函式 [{},{}]
// ==== css ====
import './_style/search-block.css'
import Link from 'next/link'

export default function SearchBlock({ setHamMenuOpen = () => {} }) {
  const [searchType, setSearchType] = useState(1) // tab 控制項( 1是商品，2是文章 )
  const [searchText, setSearchText] = useState('') // input 文字控制項
  // ==== 商品與文章的list控制項( [{},{}] ) ====
  const [forums, setForums] = useState([])
  const [products, setProducts] = useState([])

  // ==== 每當input文字改變，撈取資料庫的資料 ====
  useEffect(() => {
    const getData = async () => {
      if (searchType === 1) {
        const newProducts = await getProduct(searchText)
        setProducts(newProducts)
      }
      if (searchType === 2) {
        const newForums = await getForum(searchText)
        setForums(newForums)
      }
    }
    getData()
  }, [searchText, searchType])
  return (
    <>
      <div className="header-search-block px-3 mt-3">
        {/* ==== 搜尋欄位 ==== */}
        <div className="d-flex align-items-center">
          <label htmlFor="serch" className="px-3">
            <i className="bi bi-search fs-5" />
          </label>
          <input
            type="text"
            name="search"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value)
            }}
          />
        </div>
        {/* ==== 切換欄位 ==== */}
        <div className="w-50 mb-3">
          <Componentstab
            cates={['商品', '文章']}
            height={40}
            handleTabChange={setSearchType}
          />
        </div>
        {/* ==== 商品(文章)列表 ==== */}
        <div className="header-search-item-list header-search-item-list-mobile">
          {searchType == 1 &&
            products.map((product, i) => {
              return (
                <ProductBar
                  key={i}
                  product={product}
                  setHamMenuOpen={setHamMenuOpen}
                />
              )
            })}
          {searchType == 2 &&
            forums.map((forum, i) => {
              return (
                <ForumBar
                  forum={forum}
                  key={i}
                  setHamMenuOpen={setHamMenuOpen}
                />
              )
            })}
        </div>
      </div>
    </>
  )
}
