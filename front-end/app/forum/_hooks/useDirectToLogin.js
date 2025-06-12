'use client'

import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Link from 'next/link'

export function UseDirectToLogin({ isAuth }) {
  //   const router = useRouter()
  return (path) => {
    if (path.length === 0) {
      localStorage.setItem('redirectAfterLogin', window.location.href)
      // 但如果你傳空字串 ''，登入後會導回當前頁面，這對「追蹤」這種需要登入才能操作的功能來說，登入後應該導回原本想去的頁面（如某個 profile），而不是停留在原頁。
    } else {
      localStorage.setItem('redirectAfterLogin', path)
    }

    if (!isAuth) {
      toast.warning(
        <div className="d-flex justify-content-between w-100">
          <span>請先登入</span>
          <Link
            // href={`/member/login?callBackUrl=${encodeURIComponent(path)}`}
            href={`/member/login`}
            className="main-text-color fw-normal text-decoration-underline me-4"
          >
            前往登入
          </Link>
        </div>
      )
    }
  }
}
