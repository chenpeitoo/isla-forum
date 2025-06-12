'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import styles from './coupon-swiper.module.scss'
import CouponCardCart from '../coupon-card-cart/coupon-card-cart'

const CouponSwiper = ({
  coupons = [],
  swiperRef,
  selectedCoupon,
  onSelectCoupon,
}) => {
  return (
    <div className={styles.couponWrapper}>
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        modules={[Navigation]}
        // navigation
        spaceBetween={6}
        breakpoints={{
          0: {
            slidesPerView: 1.1,
            spaceBetween: 10,
          },
          420: {
            slidesPerView: 1.2,
            spaceBetween: 12,
          },
          768: {
            slidesPerView: 2.3,
            spaceBetween: 14,
          },
          992: {
            slidesPerView: 1.8,
            spaceBetween: 20,
          },
          1200: {
            slidesPerView: 2.5,
            spaceBetween: 20,
          },
        }}
      >
        {coupons.map((coupon) => (
          <SwiperSlide key={coupon.id}>
            <CouponCardCart
              coupon={coupon}
              selected={coupon.id === selectedCoupon?.id}
              onSelect={onSelectCoupon}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default CouponSwiper
