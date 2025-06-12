'use client'

import './_style/product-info.css'
import { useClientToken } from '@/hook/use-client-token.js'
import {
  UseProductDetail,
  UseProductIngredient,
  UseProductReviews,
} from '../../../hook/use-products'
import { useChrisR2ImageUrlDuo } from '@/hook/use-chris-r2image-url.js'
import { useAddCart } from '@/hook/use-add-cart.js'
import CommentGroup from './_component/comment-group/comment-group.js'
import CommentCat from './_component/comment-cat/comment-cat.js'
import ColorSelect from './_component/colour-select/colour-select.js'
import WishButton from '../../_components/wish-toggle.js'
import QuantitySelector from './_component/product-quantity-selector/product-quantity-selector.js'
import React, { useState, useMemo, useEffect, useCallback } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { useAuth } from '@/hook/use-auth.js'
import { toast } from 'react-toastify'

import ProductInfoAccrodion from './_component/product-info-accordion/product-info-accordion.js'
import Image from 'next/image.js'
import Link from 'next/link'
import LoadingLottie from '../_components/loading/lottie-loading.js'
import LoadingErrorLottie from '../_components/loading-error/lottie-error.js'
import ReactViewShare from './_component/recent-view-and-share/recent-view-and-share'
import ProductRelative from './_component/relative-products-products/relative-products-products'

export default function page({ params }) {
  // i don't know what is this shit, but it's warning
  const { user, isLoading: isAuthLoading } = useAuth()
  const token = useClientToken()
  const userId = user?.id
  const correct_nickname = user?.nickname
  const correct_ava_url = user?.ava_url

  const unwrappedParams = React.use(params)
  const id = unwrappedParams?.id

  // 早期返回檢查
  if (!id) return null

  const { mutate: addToCart } = useAddCart(token)

  // Fetch product detail
  const {
    data: product,
    isLoading: isLoadingProduct,
    error: errorProduct,
  } = UseProductDetail(id)

  // Reviews
  const {
    data: reviews = [],
    isLoading: isLoadingReviews,
    error: errorReviews,
  } = UseProductReviews(id)

  // Ingredients
  const {
    data: ingredients,
    isLoading: isLoadingIngredients,
    error: errorIngredients,
  } = UseProductIngredient(id)

  // === State ===
  const [selectedColorId, setSelectedColorId] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [order_price, setOrder_price] = useState(0)

  // 判斷是否為標準色（無色碼）
  const isStandardOnly = useMemo(() => {
    return (
      product?.colors?.length === 1 && product.colors[0].color_code === null
    )
  }, [product])

  useEffect(() => {
    if (
      product?.colors?.length > 0 &&
      !isStandardOnly &&
      selectedColorId === null
    ) {
      setSelectedColorId(product.colors[0].color_id)
    }
  }, [product, selectedColorId, isStandardOnly])

  useEffect(() => {
    if (product?.final_price) {
      setOrder_price(product.final_price * quantity)
    }
  }, [product?.final_price, quantity])

  useEffect(() => {
    if (product?.name) {
      document.title = `${product.name} - ISLA 美妝生活`
    }
  }, [product?.name])

  // useEffect(() => {
  //   if (
  //     product?.name &&
  //     router.asPath !== `/product/${product.product_id}商品詳細`
  //   ) {
  //     router.push(`/product/${product.id}商品詳細`, { scroll: false })
  //   }
  // }, [product, router])

  // 處理圖片
  const filenames = useMemo(() => {
    return product?.images?.map((img) => img.image_url) ?? []
  }, [product])

  const productImagesUrls = useChrisR2ImageUrlDuo(filenames)

  // 加入購物車
  const handleAddToCart = useCallback(() => {
    // 檢查是否有產品數據
    if (!product) {
      toast.warning('產品資料載入中，請稍候')
      return
    }

    const colorId = selectedColorId ?? product.colors?.[0]?.color_id

    if (!colorId && !isStandardOnly) {
      toast.warning('請先選擇顏色')
      return
    }

    addToCart(
      {
        product_id: product.product_id,
        quantity,
        color_id: colorId,
      },
      {
        onSuccess: (data) => {
          console.log('加入成功：', data)
          window.dispatchEvent(new Event('cart-updated'))
          toast.success(data?.message || '成功加入購物車')
        },
        onError: (err) => {
          console.error('加入購物車失敗：', err)
          // 可以添加錯誤提示 UI
          toast.error('加入失敗，請稍後再試')
        },
      }
    )
  }, [product, selectedColorId, isStandardOnly, addToCart, quantity])

  // 評分統計
  const getRatingCounts = useCallback((reviews) => {
    if (!Array.isArray(reviews)) return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

    return reviews.reduce(
      (acc, review) => {
        const rating = review?.rating
        if (rating >= 1 && rating <= 5) {
          acc[rating] = (acc[rating] || 0) + 1
        }
        return acc
      },
      { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    )
  }, [])

  // 評論圖片
  const reviewImages = useMemo(() => {
    if (!Array.isArray(reviews)) return []

    return reviews.flatMap((review) =>
      (review.images || []).map((img) => ({
        imageUrl: `https://isla-image.chris142852145.workers.dev/${img}`,
        reviewId: review.review_id,
      }))
    )
  }, [reviews])

  // 錯誤處理
  if (errorProduct || errorReviews || errorIngredients) {
    return (
      <div className="error-container">
        {/*<h2>載入失敗</h2>*/}
        <LoadingErrorLottie />
        <h5>載入錯誤，請重新整理頁面或稍後再試 </h5>
        {/*{errorProduct && <p>找不到產品</p>}*/}
        {/*{errorReviews && <p>產品資料錯誤</p>}*/}
        {/*{errorReviews.message}*/}
        {/*{errorIngredients && <p>產品資料錯誤</p>}*/}
        {/*{errorIngredients.message}*/}
      </div>
    )
  }

  // 資料尚未載入完成
  if (
    isLoadingProduct ||
    isLoadingReviews ||
    isLoadingIngredients ||
    isAuthLoading
  ) {
    return (
      <div className="loading-container">
        <LoadingLottie />
      </div>
    )
  }

  return (
    <>
      <ReactViewShare product={product} />
      <section className="product-main">
        <div className="product-main-container container d-flex justify-content-center align-items-center">
          <div className="product d-flex align-items-center justify-content-center">
            <div className="pic-bar d-flex align-items-center gap-3">
              {productImagesUrls.slice(0, 5).map((imgUrl, idx) => (
                <Image
                  key={idx}
                  className="pic-bar-item"
                  src={imgUrl}
                  alt={`產品圖片縮圖 ${idx + 1}`}
                  width={0}
                  height={0}
                  style={{
                    border:
                      idx === selectedIndex
                        ? '2px solid #fd7061'
                        : '1px solid #ccc',
                    borderRadius: '8px',
                  }}
                  onClick={() => setSelectedIndex(idx)}
                />
              ))}
            </div>
            <div className="pic-show">
              <Zoom>
                <img
                  alt="Zoomable"
                  src={productImagesUrls[selectedIndex]}
                  className="pic-show-item"
                />
              </Zoom>
            </div>
            <div className="product-index d-flex flex-column justify-content-between">
              <div className="index-top">
                <div className="top-main">
                  <Link href={`/product?brandIds=${product?.brand.brand_id}`}>
                    <div className="brand">{product?.brand.name}</div>
                  </Link>
                  <div className="name">{product.name}</div>
                </div>
                <div className="description">{product.description}</div>
              </div>
              <div className="index-bottom d-flex flex-column">
                <div className="color-select-box d-flex align-items-center">
                  {!isStandardOnly && (
                    <ColorSelect
                      colors={product.colors}
                      selectedColorId={selectedColorId}
                      onChange={setSelectedColorId}
                    />
                  )}
                </div>
                <div className="number-select-bookmark-box d-flex align-items-center w-100 justify-content-between">
                  <QuantitySelector
                    quantity={quantity}
                    setQuantity={setQuantity}
                  />
                  <WishButton
                    token={token}
                    type="product"
                    id={product.product_id}
                  />
                </div>
                <div className="price-box d-flex align-items-center ">
                  <div className="price">NT${parseInt(order_price)}</div>{' '}
                  <button
                    className="add-cart"
                    type="button"
                    onClick={handleAddToCart}
                  >
                    加入購物車
                  </button>{' '}
                </div>
              </div>
            </div>
          </div>
          <CommentCat reviews={reviews} />
        </div>
      </section>
      <section className="product-info">
        <div className="container product-info-container">
          <div className="product-indo-title w-100 d-flex justify-content-center align-items-center">
            產品資訊
          </div>
          <div className="relative-tag-box d-flex flex-column">
            <div className="relative-tag-title">相關類別</div>
            <div className="relative-tags d-flex align-items-center gap-3">
              {product.tags?.map((tag) => (
                <Link key={tag.tag_id} href={`/product?tagIds=${tag.tag_id}`}>
                  <button className="relative-tag" type="button">
                    {tag.name}
                  </button>
                </Link>
              ))}
            </div>
          </div>
          <div className="product-info">
            <ProductInfoAccrodion
              ingredients={ingredients}
              usage={product.usage_instructions}
            />
          </div>
          <CommentGroup
            reviews={reviews}
            averageRating={product.average_rating}
            ratingCounts={getRatingCounts(reviews)}
            reviewImages={reviewImages}
            productId={product.product_id}
            userId={userId}
            userName={correct_nickname}
            userAvatar={correct_ava_url}
          />
        </div>
      </section>
      <section className="relative-products">
        <div className="relative-products-title-box">
          <div className="relative-products-title-main">猶豫不決嗎？</div>
          <div className="relative-products-title-sub">下面有其他類似商品</div>
          <ProductRelative />
        </div>
        <div className="relative-products-cards"></div>
      </section>
    </>
  )
}
