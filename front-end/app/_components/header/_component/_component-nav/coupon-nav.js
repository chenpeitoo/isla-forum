'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import './coupon-nav.css'

export default function CouponNav({ open = false }) {
  const isOpen = open ? 'd-flex' : 'd-none'
  return (
    <>
      <div
        className={
          'coupon-nav-menu-box flex-column align-items-center position-absolute overflow-hidden' +
          ' ' +
          isOpen
        }
      >
        <Link className="coupon-nav-menu-text" href="/coupon/products">
          商品優惠券
        </Link>
        <Link className="coupon-nav-menu-text" href="/coupon/courses">
          課程優惠券
        </Link>
      </div>
    </>
  )
}
