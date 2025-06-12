'use client'
import React from 'react'
import ProductCard from './product-card-s' // 假設 ProductCard.jsx 在同一個資料夾或相對路徑
import SidebarFilterDesktop from './desktop-filter'

function ParentComponent() {
  // 1. 定義一個產品物件，確保它有 ProductCard 需要的欄位
  const products = [
    {
      id: 'prod001',
      brand: 'Brand',
      name: 'ProductName1',
      price: '$199.99',
      originalPrice: '$249.99', // 可選
      rating: 4,
      reviews: 120,
      imageUrl: `images/product/test/1.jpg`,
      isBookmarked: false,
    },
    {
      id: 'prod002',
      brand: 'Brand',
      name: 'ProductName2',
      price: '$499.00',
      rating: 5,
      reviews: 75,
      imageUrl: `images/product/test/test1.png`,
      isBookmarked: true,
    },
  ]

  return (
    <div>
      <h1>我們的產品</h1>
      <SidebarFilterDesktop />
      {/* 2. 使用 ProductCard 元件來顯示產品 */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default ParentComponent
