'use client'

import { useState } from 'react'
import Link from 'next/link'
import CouponNav from './_component-nav/coupon-nav'

export default function HeaderNav() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <nav className="order-lg-2 d-lg-block d-none">
        <ul className="d-flex flex-lg-row flex-column justify-content-center align-items-center">
          <li>
            <Link href="/product">美妝商城</Link>
          </li>
          <li>
            <Link href="/course">美妝教室</Link>
          </li>
          <li
            className="position-relative"
            onMouseEnter={() => {
              setOpen(true)
            }}
            onMouseLeave={() => {
              setOpen(false)
            }}
          >
            <Link href="/">優惠券專區</Link>
            <CouponNav open={open} />
          </li>
          <li>
            <Link href="/forum">美妝論壇</Link>
          </li>
        </ul>
      </nav>
    </>
  )
}
