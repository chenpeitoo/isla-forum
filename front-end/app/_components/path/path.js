'use client'

import { usePathname } from 'next/navigation'
// import React, { useState, useEffect } from 'react'
import Link from 'next/link'
// ==== method ====
import {
  getCoursePath,
  getExperiencePath,
  getTeacherPath,
} from './_method/course-path'
import { getProductPath } from './_method/product-path'
// ==== css ====
import './_style/path.css'
import { useEffect, useState } from 'react'

export default function Path() {
  const pathname = usePathname()
  // 新增條件判斷：只要是課程詳細頁，就不要顯示這條麵包屑
  const isHiddenPath = pathname.startsWith('/course/course-list/')
  const [pathArrTag, setPathArrTag] = useState([])
  let pathArr = pathname.split('/') // "/member/profile" => ['',member,profile]
  // const [pathArr, setPathArr] = useState(pathname.split('/'))

  // ==== 為每個 tag 整理新的 href ====
  const getPath = (thisPath) => {
    let address = ''
    for (let path of pathArr) {
      address += path + '/'
      if (path === thisPath) break
    }
    return address
  }

  // console.log('pathArr:', pathArr)
  // console.log('pathArrTag:', pathArrTag)

  useEffect(() => {
    // console.log('==== useEffect Start ====')
    // ==== (function )將 pathArr 的內容改為中文(tag 為中文) ====
    let prevPath = ''
    async function convertToChinese(thisPath) {
      if (prevPath === 'course-list') {
        return await getCoursePath(thisPath)
      }
      if (prevPath === 'experience') {
        // return getCoursePath(thisPath)
        return await getExperiencePath(thisPath)
      }
      if (prevPath === 'teacher') {
        return await getTeacherPath(thisPath)
      }
      if (prevPath === 'product') {
        return await getProductPath(thisPath)
      }
      prevPath = thisPath
      switch (thisPath) {
        case '':
          return '首頁'
        case 'member':
          return '會員中心'
        case 'coupon':
          return '優惠券專區'
        case 'course':
          return '美妝教室'
        case 'product':
          return '所有產品'
        case 'login':
          return '登入'
        case 'profile':
          return '基本資料'
        case 'password':
          return '密碼'
        case 'forget-password':
          return '忘記密碼'
        case 'register':
          return '註冊'
        case 'order':
          return '訂單'
        case 'like-list':
          return '願望清單'
        case 'course-list':
          return ''
        case 'experience':
          return ''
        case 'teacher':
          return ''
        case 'cart':
          return '購物車'
        case 'payment':
          return '付款及運送方式'
        case 'my-forum':
          return '我的論壇'
        case 'my-following':
          return '我的追蹤'
        case 'my-post':
          return '我的文章'
        case 'saved-post':
          return '收藏文章'
          return '商品優惠券'
        case 'courses':
          return '課程優惠券'
        case 'products':
          return '商品優惠券'

        default:
          return thisPath
      }
    }
    // ==== 將 pathArr 的內容改為中文(tag 為中文) ====
    const getPath = async () => {
      const newPathArrTag = []
      for (let i = 0; i < pathArr.length; i++) {
        newPathArrTag[i] = await convertToChinese(pathArr[i])
      }

      // console.log('in UseEffect async', newPathArrTag)
      setPathArrTag(newPathArrTag)
    }
    // console.log('in UseEffect', pathArrTag)
    getPath()

    // console.log('==== useEffect End ====')
  }, [pathArr[pathArr.length - 1]])
  // 首頁,文章，創造優惠券列表不需要麵包削
  if (
    pathname === '/' ||
    pathname.includes('/forum') ||
    pathname.includes('/coupon/create') ||
    pathname.includes('/login') ||
    pathname.includes('/register') ||
    pathname.includes('/forget-password') ||
    pathname.startsWith('/course') ||
    !pathArrTag[0]
  ) {
    return <></>
  }
  return (
    <>
      <div className="d-flex position-absolute bread-container">
        {pathArr.map((path, i) => {
          if (pathArrTag[i] === '') {
            return
          }
          return (
            <div key={i} className="d-flex gap-1 ps-1">
              <Link href={getPath(path)} className="path-link">
                {pathArrTag[i]}
              </Link>
              {i < pathArr.length - 1 && <span className="path-link">/</span>}
            </div>
          )
        })}
      </div>
    </>
  )
}
