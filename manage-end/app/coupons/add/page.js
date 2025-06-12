'use client'

import { useState } from 'react'
import NewCouponAdd from '../_components/new-coupon-add'
import useCouponOption from '@/hook/use-coupon-options'
import { toast } from 'react-toastify'

export default function CouponAddPage() {
  const { brands, categories, courseCategories } = useCouponOption()

  // 建立優惠券後顯示提示，自動滾動至頂部
  const handleCreate = async (form, resetForm) => {
    const token = localStorage.getItem('jwtToken')
    const res = await fetch('http://localhost:3005/api/coupon/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    })

    const result = await res.json()
    if (result.status === 'success') {
      resetForm() // 清空表單
      window.scrollTo({
        // 滾動到頂部
        top: 0,
        behavior: 'smooth',
      })
      toast.success('優惠券新增成功')
    } else {
      toast.error('新增失敗')
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 新增表單元件 */}
      <NewCouponAdd
        brands={brands}
        categories={categories}
        courseCategories={courseCategories}
        onSubmit={handleCreate}
      />
    </div>
  )
}
