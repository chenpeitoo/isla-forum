'use client'

import React, { useState, useEffect } from 'react'
// ==== component ====
import Componentstab from '@/app/_components/tab'
import ForumBar from './_component/forum-bar'
import ProductBar from './_component/product-bar'
// ==== method ====
import getForum from './_method/getForum'
import getProduct from './_method/getProduct'
// ==== css ====
import './_style/search-block-lg.css'
import './_style/search-block.css'

export default function SearchBlockLg({ open = true }) {
  const [searchType, setSearchType] = useState(1)
  const [searchText, setSearchText] = useState('')
  const [forums, setForums] = useState([])
  const [products, setProducts] = useState([])
  // console.log('searchText', searchText)
  const isOpen = open ? 'd-flex' : 'd-none'
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
      <div className={'header-search-block-lg for-product px-3' + ' ' + isOpen}>
        {/* ==== 搜尋欄位 ==== */}
        <div className="d-flex align-items-center ps-4 mt-3 header-search-block-lg-search">
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
        <div className="header-search-block-lg-search-Componentstab mb-3">
          <Componentstab
            cates={['商品', '文章']}
            height={35}
            handleTabChange={setSearchType}
          />
        </div>
        {/* ==== 商品(文章)列表 ==== */}
        <div className="header-search-item-list">
          {searchType == 1 &&
            products.slice(0, 10).map((product, i) => {
              return <ProductBar product={product} key={i} />
            })}
          {searchType == 2 &&
            forums.slice(0, 10).map((forum, i) => {
              return <ForumBar forum={forum} key={i} />
            })}
        </div>
      </div>
    </>
  )
}
