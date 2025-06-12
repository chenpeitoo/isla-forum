'use client'

import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import Image from 'next/image'
import './_style/coupon-section.css'

import 'swiper/css'
import 'swiper/css/navigation'

export default function MainCouponSection(props) {
  const images = ['http://localhost:3005/images/ad/discount-info.jpg']
  return (
    <>
      <div className="main-sub-page-swiper-contrainer ">
        <Swiper
          speed={1300}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={1} // 改為 1，只顯示一張
          spaceBetween={0} // 改為 0，因為只顯示一張
          modules={[Navigation]} // 添加 Navigation 模組
          loop={true}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          className="main-page-main-swiper main-page-main-swiper-coupon"
        >
          {images.map((src, index) => (
            <SwiperSlide
              key={index}
              className="d-flex justify-content-center"
              style={{
                width: '100vw',
                maxWidth: '850px',
                height: 'auto',
              }}
            >
              <div
                className="position-relative w-100 overflow-hidden"
                style={{
                  paddingTop: '56.25%', // 維持 16:9 比例
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
    </>
  )
}
