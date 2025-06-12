// src/components/ProductCard.jsx
'use client'

import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import '../_style/product-card-l.css'
import RatingComponent from '../../../../product/_components/product-rating.js'
import BookmarkComponent from '../../../../product/_components/product-bookmark.js'
import Image from 'next/image'
import Link from 'next/link'
import { useClientToken } from '@/hook/use-client-token.js'
import { useAuth } from '@/hook/use-auth.js'
import { useAddCart } from '@/hook/use-add-cart.js'
import { useToggleWish } from '@/hook/use-toggle-wish.js'
import WishButton from '../../../wish-toggle.js'
import { toast } from 'react-toastify'

function ProductCard({ product }) {
  const { user, isLoading: isAuthLoading } = useAuth()
  const token = useClientToken()
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const { mutate: addToCart } = useAddCart(token)

  const {
    id,
    brand = 'N/A',
    category_name = '',
    name = 'Unnamed Product',
    price = '0',
    originalPrice,
    rating = 0,
    reviews = 0,
    imageUrl = `/images/product/test/test1.png`,
    isBookmarked: initialIsBookmarked = false,
    isColorful,
  } = product
  const { isFavorited, toggleFavorite } = useToggleWish(token, 'product', id)

  // ✅ 加入購物車
  const handleAddToCart = (e) => {
    e.preventDefault()
    console.log(`Product ${id} (${name}) added to cart.`)
    const quantity = 1
    addToCart(
      {
        product_id: product.id,
        quantity,
      },
      {
        onSuccess: (data) => {
          window.dispatchEvent(new Event('cart-updated'))
          toast.success(data?.message || '成功加入購物車')
          // 可以添加成功提示 UI
        },
        onError: (err) => {
          console.error('加入購物車失敗：', err)
          // 可以添加錯誤提示 UI
          toast.error('加入購物車失敗，請稍後再試')
        },
      }
    )
  }

  // ✅ SSR 安全的 RWD 偵測
  const useIsMobile = (breakpoint = 1400) => {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < breakpoint)
      }

      handleResize() // 初始化
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }, [breakpoint])

    return isMobile
  }

  const isMobile = useIsMobile()

  const IMAGE_PREFIX = 'https://isla-image.chris142852145.workers.dev/'
  const fullImageUrl = `${IMAGE_PREFIX}${imageUrl}`
  const productUrl = `http://localhost:3000/product/${id}`

  if (!product || isAuthLoading) {
    return null
  }

  return (
    <Link href={productUrl} passHref>
      <div className="product-card-l-product_card" key={id}>
        <div className="product-card-l-product_card-head">
          <div className="product-card-head-top d-flex justify-content-end">
            {/* <div className="product-l-card-rating product-l-card-rating-desktop">
              <div className="product-card-star-box">
                <RatingComponent rating={rating} reviewCount={reviews} />
              </div>
            </div> */}
            <BookmarkComponent
              isbookmarked={isFavorited}
              isMobile={isMobile}
              onToggle={(e) => {
                e.preventDefault()
                toggleFavorite()
              }}
            />
          </div>

          <div className="product-card-l-product_card-img image-container">
            <div className="skeleton-image" />
            <Image
              src={fullImageUrl}
              alt={name}
              onLoad={() => setIsImageLoaded(true)}
              className={`card-img ${isImageLoaded ? 'fade-in' : 'hidden'}`}
              width={0}
              height={0}
            />
          </div>

          <div className="product-card-hover-add-cart">
            <button
              onClick={handleAddToCart}
              className="product-card-add-cart-btn"
            >
              加入購物車
            </button>
          </div>
        </div>

        <div className="product-card-l-product_card-info">
          <div className="product-card-info">
            <div className="product-card-product_details">
              <div className="d-flex">
                <div className="product-card-product_category">
                  {category_name}
                </div>
                <div className="product-card-brand">{brand}</div>
              </div>
              <div className="product-card-product_name">{name}</div>
            </div>
          </div>

          <div className="product-l-card-rating">
            <div className="product-card-star-box">
              <RatingComponent
                rating={rating}
                reviewCount={reviews}
                isMobile={false}
              />
            </div>
          </div>

          <div className="product-card-price d-flex justify-content-between">
            <div className="product-card-price-box d-flex gap-2">
              <div className="product-card-main-price">
                NT$ {parseInt(price).toLocaleString()}
              </div>
              {originalPrice && originalPrice !== price && (
                <div className="product-card-basic-price">
                  <del>${parseInt(originalPrice).toLocaleString()}</del>
                </div>
              )}
            </div>
            {isColorful && isColorful !== '1' && (
              <div className="product-card-tag">多色可選</div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    brand: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.string,
    originalPrice: PropTypes.string,
    rating: PropTypes.number,
    reviews: PropTypes.number,
    imageUrl: PropTypes.string,
    isBookmarked: PropTypes.bool,
  }).isRequired,
}

export default ProductCard
