'use client'

import React, { useState, useEffect, Suspense } from 'react'
// ==== component ====
import Componentstab from '../_component/tab/tab'
// import ProductListContainer from './_component/product-list-container'
// import CourseListContainer from './_component/course-list-container'
import WishProductListTable from './_component/product-list-table/product-list-table'
import WishCourseListTable from './_component/course-list-table/course-list-table'
// ==== style ====
import '../_styles/style.css'

export default function LikeListPage(props) {
  const tab = ['商品', '課程']
  const [tabSwitch, setTabSwitch] = useState(1)

  return (
    <div className="user-content">
      <h3>願望清單</h3>
      <Componentstab cates={tab} handleTabChange={setTabSwitch} />

      <Suspense fallback={<div>載入中...</div>}>
        {tabSwitch === 1 && <WishProductListTable />}
      </Suspense>

      <Suspense fallback={<div>載入中...</div>}>
        {tabSwitch === 2 && <WishCourseListTable />}
      </Suspense>
    </div>
  )
}
