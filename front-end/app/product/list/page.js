'use client'
import React, { useCallback } from 'react'
import { useState, useEffect } from 'react'
import { useProducts } from '../../../hook/use-products'
import SidebarFilter from '../_components/desktop-filter'
import MobileBottomFilter from '../_components/mobile-bottom-filter.js'
import ProductCard from '../_components/product-card-s'
import '../_style.css/product-list.css'
import useMobileDisplay from '../../../hook/use-mobile-display.js'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'

// 簡單的篩選快取管理
const FILTER_CACHE_KEY = 'product_filters_cache'

const saveFiltersToCache = (filters) => {
  try {
    const filterData = {
      filters,
      timestamp: Date.now(),
    }
    sessionStorage.setItem(FILTER_CACHE_KEY, JSON.stringify(filterData))
  } catch (error) {
    console.warn('無法保存篩選快取:', error)
  }
}

const loadFiltersFromCache = () => {
  try {
    const cached = sessionStorage.getItem(FILTER_CACHE_KEY)
    if (cached) {
      const { filters, timestamp } = JSON.parse(cached)
      // 快取有效期1小時
      if (Date.now() - timestamp < 60 * 60 * 1000) {
        return filters
      }
    }
  } catch (error) {
    console.warn('無法讀取篩選快取:', error)
  }
  return null
}

const clearFiltersCache = () => {
  try {
    sessionStorage.removeItem(FILTER_CACHE_KEY)
  } catch (error) {
    console.warn('無法清除篩選快取:', error)
  }
}

export default function ProductPage() {
  const isMobile = useMobileDisplay('(max-width: 768px)')
  console.log('isMobile:', isMobile)
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()
  const parseArrayParam = (value) =>
    value ? value.split(',').map((v) => (isNaN(+v) ? v : +v)) : []

  // 檢查是否有URL參數傳入
  const hasUrlParams = searchParams.toString().length > 0

  const getInitialFilters = () => {
    // 如果有URL參數，優先使用URL參數並清除快取
    if (hasUrlParams) {
      clearFiltersCache()
      return {
        keyword: searchParams.get('keyword') || '',
        brandIds: parseArrayParam(searchParams.get('brandIds')),
        tagIds: parseArrayParam(searchParams.get('tagIds')),
        categoryIds: parseArrayParam(searchParams.get('categoryIds')),
        minRating: +(searchParams.get('minRating') || 0),
        maxRating: +(searchParams.get('maxRating') || 5),
        minPrice: +(searchParams.get('minPrice') || 0),
        maxPrice: +(searchParams.get('maxPrice') || 9999),
        onSaleOnly: searchParams.get('onSaleOnly') === 'true',
        selectedPriceRangeKeys: parseArrayParam(
          searchParams.get('selectedPriceRangeKeys')
        ),
        sortBy: searchParams.get('sortBy') || '',
        sortOrder: searchParams.get('sortOrder') || 'ASC',
      }
    }

    // 嘗試從快取讀取
    const cachedFilters = loadFiltersFromCache()
    if (cachedFilters) {
      console.log('使用快取的篩選條件:', cachedFilters)
      return cachedFilters
    }

    // 預設值
    return {
      keyword: '',
      brandIds: [],
      tagIds: [],
      categoryIds: [],
      minRating: 0,
      maxRating: 5,
      minPrice: 0,
      maxPrice: 9999,
      onSaleOnly: false,
      selectedPriceRangeKeys: [],
      sortBy: '',
      sortOrder: 'ASC',
    }
  }

  const [filters, setFilters] = useState(getInitialFilters)

  const handleFilterChange = (partialUpdate) => {
    setFilters((prev) => {
      const updated = { ...prev, ...partialUpdate }

      // 檢查是否有變化
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

      if (
        partialUpdate.onSaleOnly !== undefined &&
        prev.onSaleOnly !== partialUpdate.onSaleOnly
      ) {
        hasChanged = true
      }

      if (hasChanged) {
        // 保存到快取
        saveFiltersToCache(updated)
        return updated
      }

      return prev
    })
  }

  const { products, productsLoading, productsError, brands, categories, tags } =
    useProducts(filters)

  useEffect(() => {
    console.log('Filters 更新 :', filters)
  }, [filters])

  // 當URL參數變化時，重新初始化篩選器
  useEffect(() => {
    if (hasUrlParams) {
      const newFilters = getInitialFilters()
      setFilters(newFilters)
    }
  }, [searchParams])

  const toggleMobilePanel = useCallback(() => {
    setIsMobilePanelOpen((prev) => !prev)
  }, [])

  const ProductList = ({ products }) => {
    if (!products || !Array.isArray(products) || products.length === 0) {
      return (
        <div className="no-product-container">
          <div className="no-products-image-wrapper">
            <Image
              src={'/images/product-elements/no-more-product-3.png'}
              alt={'No Products'}
              width={400}
              height={400}
              className="no-product-image"
            />
            {/*<AiTwotoneMeh style={{ width: '100%', height: 'auto' }} />*/}
          </div>
          <p className="no-product-message">沒有符合條件的商品了</p>
        </div>
      )
    }

    return (
      <div className="product-list">
        {products.map((p) => (
          <div key={p.product_id} className="product-card-container">
            <ProductCard
              product={{
                id: p.product_id,
                brand: p.brand_name,
                name: p.name,
                price: p.final_price,
                originalPrice: p.base_price,
                rating: p.avg_rating,
                reviews: p.review_count,
                imageUrl: p.primary_image_url,
                isBookmarked: p.is_bookmarked,
                isSale: p.is_on_sale,
                isColorful: p.color_ids,
              }}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="product-body container">
      {isMobile ? (
        <>
          <MobileBottomFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            brands={brands || []}
            categories={categories || []}
            tags={tags || []}
            isPanelOpen={isMobilePanelOpen}
            onTogglePanel={toggleMobilePanel}
          />
        </>
      ) : (
        <div className="filter-container">
          <SidebarFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            brands={brands || []}
            categories={categories || []}
            tags={tags || []}
          />
        </div>
      )}
      <div className="productlist">
        <ProductList products={products} />
      </div>
    </div>
  )
}
