'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
// ==== compoents ====
import Componentstab from '@/app/_components/tab'
import BrandSelect from './_component/brand-select'
import ProductCard from './_component/product-card-l'
import SwiperProduct from './_component/swiper-product.js'
import './_style/product-section.css'
// ==== hooks ====
import { useProducts } from '@/hook/use-products'
// ==== css ====

export default function ProductSectionBrand() {
  // ==== 取得商品資料 ====
  const [filters, setFilters] = useState({
    keyword: '',
    brandIds: [3],
    tagIds: [],
    categoryIds: [],
    minRating: 0,
    maxRating: 5,
    minPrice: 0,
    maxPrice: 9999,
    onSaleOnly: false,
    selectedPriceRangeKeys: [], // 保存未被parsePriceRanges轉換的價格區間
    sortBy: '',
    sortOrder: 'ASC',
  })
  const { products } = useProducts(filters)
  // ==== END 取得商品資料 ====
  // ==== tab setting ====
  const navBrands = [
    'Unleashia',
    "A'Piuw",
    'COSLORI',
    'MUZIGAE MANSION',
    'Kaja',
    'Rom&nd',
  ]
  // ==== END tab setting ====
  const [tabSwitch, setTabSwitch] = useState(1)
  const handleFilterChange = (partialUpdate) => {
    setFilters((prev) => {
      const updated = { ...prev, ...partialUpdate }
      // 更安全的比較方式是比較每個 key，或者相信 React 的 setState 機制
      // 這裡我們假設 partialUpdate 總是包含"有效"的更新
      let hasChanged = false
      for (const key in partialUpdate) {
        if (Object.prototype.hasOwnProperty.call(partialUpdate, key)) {
          if (
            JSON.stringify(prev[key]) !== JSON.stringify(partialUpdate[key])
          ) {
            hasChanged = true
            break
          }
        }
      }
      return hasChanged ? updated : prev
    })
  }
  useEffect(() => {
    console.log('==== useEffect: tabswitch ====')
    handleFilterChange({ brandIds: [tabSwitch] })

    console.log('==== END ====')
    // eslint-disable-next-line
  }, [tabSwitch])
  return (
    <>
      {/* <SwiperProduct /> */}
      <div className="d-flex flex-column align-items-center gap-4">
        <div className="d-flex flex-column align-items-center gap-4">
          <h3 className="main-product-section-title">品牌暢銷商品</h3>
          <div className="d-lg-block d-none">
            <Componentstab cates={navBrands} handleTabChange={setTabSwitch} />
          </div>
          <BrandSelect
            navBrands={navBrands}
            tabSwitch={tabSwitch}
            setTabSwitch={setTabSwitch}
          />
        </div>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-lg-4 g-4 p-0 m-0 mt-4">
          <div className="product-list product-list-main-page">
            {products.slice(0, 4).map((p, i) => (
              <div className="product-card-container" key={p.product_id}>
                <ProductCard
                  product={{
                    id: p.product_id,
                    brand: p.brand_name,
                    name: p.name,
                    category_name: p.category_name,
                    price: p.final_price,
                    originalPrice: p.base_price,
                    rating: p.avg_rating,
                    reviews: p.review_count,
                    imageUrl: p.primary_image_url,
                    isBookmarked: p.is_bookmarked,
                    isSale: p.is_on_sale,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <Link href={`/product?brandIds=${tabSwitch}`} className="mt-4 pt-4">
          <button className="btn btn-primary">
            查看更多 {navBrands[tabSwitch - 1]} 商品
          </button>
        </Link>
      </div>
    </>
  )
}
