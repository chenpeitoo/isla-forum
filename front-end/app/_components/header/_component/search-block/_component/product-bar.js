'use client'

import Image from 'next/image'
import Link from 'next/link'
// ==== route ====
import { PRODUCT_IMG_URL } from '@/_route/img-url'
// ==== css ====
import '../_style/product.css' // 卡片css
import './product-bar.css'

export default function ProductBar({
  product = { brand: 'eee', title: 'weeeeeee', price: 3000 },
  setHamMenuOpen = () => {},
}) {
  const product_url = '/product/' + product?.product_id
  return (
    <>
      {/* === card ==== */}
      <Link
        href={product_url}
        onClick={() => {
          setHamMenuOpen(false)
        }}
        className="header-search-item header-search-item-product for-product"
      >
        {/* === product image ==== */}
        <div className="search-item-img search-item-img-product">
          <Image
            src={PRODUCT_IMG_URL + product.productImg}
            alt={product.productName || '商品圖片'}
            width={100}
            height={100}
            sizes="65px"
            className="search-item-img-real"
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        </div>
        {/* === title & price ... ==== */}
        <div className="d-flex flex-column gap-2 w-100">
          <div className="search-item-title search-item-title-p">
            {product.title}
          </div>
          <div className="d-flex w-100 gap-3">
            <div className="search-item-brand search-item-brand-p">
              {product.brand}
            </div>
            <div className="search-item-price search-item-price-p">
              NT$ {product.price}
            </div>
          </div>
        </div>
      </Link>
    </>
  )
}
