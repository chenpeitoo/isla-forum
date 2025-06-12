'use client'

import Image from 'next/image'
import Link from 'next/link'
import Componentstab from './_components/tab'
// ==== section component ====
// import ImageSlider from '@/app/_components/_component-main-page/banner-2/image-slider'
import MainBanner from './_components/_component-main-page/banner/main-banner'
import CourseSection from '@/app/_components/_component-main-page/course/course-section'
import ForumSection from '@/app/_components/_component-main-page/forum/forum-section'
import MainCouponSection from '@/app/_components/_component-main-page/coupon/main-coupon-section'
import CouponSection from '@/app/_components/_component-main-page/coupon/coupon-section'
import ProductSectionBrand from '@/app/_components/_component-main-page/product/product-section-brand'
import ProductSectionNew from '@/app/_components/_component-main-page/product/product-section-new'
import BrandSection from './_components/_component-main-page/brand/brand-section'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'

import 'swiper/css' // 必要
import 'swiper/css/navigation' // 如果用導航
import 'swiper/css/pagination' // 如果用分頁

// import 'swiper/swiper.min.css'
// ==== END section component ====
// ==== css ====
import './_styles/main-page.css'
// ==== react hooks ====
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
// ==== home animation by song ====
import HomeAnimationSplash from './home-animation/splash'

export default function Home() {
  const [showMain, setShowMain] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)

  const images = [
    'http://localhost:3005/images/ad/isla-ad.001.jpeg',
    'http://localhost:3005/images/ad/isla-ad.002.jpeg',
    'http://localhost:3005/images/ad/isla-ad.003.jpeg',
    'http://localhost:3005/images/ad/isla-ad4.png',
    'http://localhost:3005/images/ad/isla-ad.005.jpeg',
  ]
  const swiperSubImages = ['http://localhost:3005/images/ad/discount-info.jpg']

  const router = useRouter()
  // const handleForumTab = () => {}

  // 使用session
  useEffect(() => {
    const token = localStorage.getItem('jwtToken')
    const seen = sessionStorage.getItem('hasSeenHomeAnimation')

    if (!seen) {
      // 第一次登入還沒播動畫
      setShowMain(false)
    } else {
      // 沒登入或已播過
      setShowMain(true)
    }

    setHasChecked(true) // 已判斷完動畫狀態
  }, [])

  const handleFinishAnimation = () => {
    sessionStorage.setItem('hasSeenHomeAnimation', 'true')
    setShowMain(true)
  }

  if (
    !hasChecked ||
    (!showMain && !sessionStorage.getItem('hasSeenHomeAnimation'))
  ) {
    return <HomeAnimationSplash onFinish={handleFinishAnimation} />
  }

  return (
    <>
      <div>
        {/* banner */}
        {/* <MainBanner /> */}
        <div className="w-100 main-page-swiper-contrainer">
          <Swiper
            speed={1300}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            spaceBetween={10}
            modules={[Autoplay, Pagination]}
            pagination={{ clickable: true }}
            // className="mySwiper"
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            className="main-page-main-swiper"
          >
            {images.map((src, index) => (
              <SwiperSlide
                key={index}
                className="d-flex justify-content-center"
                style={{
                  width: '100vw', // 使用 viewport 寬度
                  maxWidth: '1350px', // 限制最大寬
                  height: 'auto', // 高度交給內部 div 控制
                }}
              >
                <div
                  className="position-relative w-100 overflow-hidden"
                  style={{
                    paddingTop: '56.25%', // 高度用 padding 百分比技巧維持 16:9（56.25%）
                  }}
                >
                  <Image
                    src={src}
                    alt={`Slide ${index}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* <ImageSlider /> */}
        {/* main page */}
        <section className="section-main-page">
          {/* ---- START product ---- */}
          <section className="subsection-main-page">
            <ProductSectionBrand />
          </section>
          <section className="subsection-main-page">
            <ProductSectionNew />
          </section>
          {/* ---- END product ---- */}
          {/* ---- START main coupon ---- */}
          <section className="subsection-main-page subsection-main-page-coupon-bg">
            <div className="main-sub-page-swiper-contrainer">
              <Swiper
                speed={1300}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={1}
                spaceBetween={0}
                modules={[Autoplay, Navigation]}
                loop={true}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                navigation={{
                  nextEl: '.swiper-button-next-custom',
                  prevEl: '.swiper-button-prev-custom',
                }}
                className="main-page-main-swiper main-page-main-swiper-coupon"
              >
                {swiperSubImages.map((src, index) => (
                  <SwiperSlide
                    key={index}
                    className="d-flex justify-content-center"
                    style={{
                      width: '80vw',
                      maxWidth: '1000px',
                      height: 'auto',
                    }}
                  >
                    <div
                      className="position-relative w-100 overflow-hidden swiper-inside"
                      style={{
                        paddingTop: '46.8%', // 維持 16:9 比例
                      }}
                    >
                      <Image
                        src={src}
                        alt={`Slide ${index}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}

                {/* 自定義箭頭 */}
                <div className="swiper-button-prev-custom">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="15,18 9,12 15,6"></polyline>
                  </svg>
                </div>
                <div className="swiper-button-next-custom">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="9,18 15,12 9,6"></polyline>
                  </svg>
                </div>
              </Swiper>
            </div>
          </section>
          {/* ---- END main coupon ---- */}
          {/* ---- START course ---- */}
          <section className="container subsection-main-page">
            <CourseSection />
          </section>
          {/* ==== END course ==== */}
          {/* ==== START coupons ==== */}
          <section className="subsection-main-page">
            <CouponSection />
          </section>
          {/* ==== END coupons ==== */}
          {/* ==== START forum ==== */}
          <section className="container subsection-main-page">
            <ForumSection />
          </section>
          {/* ==== show brand ====  */}
          <section>
            <BrandSection />
          </section>
          {/* ---- END forum ---- */}
        </section>
      </div>
    </>
  )
}
