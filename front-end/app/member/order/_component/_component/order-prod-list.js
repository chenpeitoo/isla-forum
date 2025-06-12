'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
// ==== route ====
import { COURSE_BANNER_URL } from '@/_route/img-url'
import {
  COURSE_PAGE_URL,
  PRODUCT_PAGE_URL,
  EXPERIENCE_PAGE_URL,
} from '@/_route/page-url'
import { PRODUCT_IMG_URL } from '@/_route/img-url'
// ==== method ====
import { formatted } from '../../../_method/method'

export default function OrderProdList({ order_id = 0 }) {
  const [openProd, setOpenProd] = useState(false)
  const btnProdContent = openProd ? '收起明細' : '展開明細'
  const prodListControl = openProd ? '' : 'closeProdList'
  // ==== item info ====
  const [item, setItems] = useState([])
  console.log('item: ', item)
  // ==== 清單函式 ====
  const switchItem = (item) => {
    switch (item?.item_type) {
      case 'product':
        return {
          src: PRODUCT_IMG_URL + item?.product_pic,
          href: PRODUCT_PAGE_URL + item?.product_id,
          title: item?.product_tit,
          type: '商品',
        }
      case 'course':
        return {
          src: COURSE_BANNER_URL + item?.course_pic,
          href: COURSE_PAGE_URL + item?.course_id,
          title: item?.course_tit,
          type: '課程',
        }
      case 'experience':
        return {
          src: COURSE_BANNER_URL + item?.experience_pic,
          href: EXPERIENCE_PAGE_URL + item?.course_experience_id,
          title: item?.experience_tit,
          type: '體驗',
        }
    }
  }
  // ==== 取得細項資料 ====
  let itemRead = true // 只讀取一次，讀取完後變 false
  const getItems = async () => {
    console.log('order_id', order_id)
    if (!itemRead) return console.log('細項已讀取')
    itemRead = false
    const token = localStorage.getItem('jwtToken')
    if (!token) return alert('無效登入')
    try {
      const response = await fetch(
        'http://localhost:3005/api/member/order/item',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: parseInt(order_id) }),
        }
      )
      const data = await response.json()
      if (response.ok) {
        setItems(data['data'])
        console.log('data', data['data'])
      }
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <>
      <div
        className={
          'd-flex flex-column justify-content-between align-items-center overflow-hidden prodList' +
          ' ' +
          prodListControl
        }
      >
        {item.map((item, i) => {
          const { src, href, title, type } = switchItem(item)
          return (
            <div
              key={i}
              className="row justify-content-start gy-2 ms-3 mb-3 w-100"
            >
              <div className="prodImg">
                <Image
                  src={src}
                  alt={item.course_pic || 'course pic'}
                  width={'50'}
                  height={'50'}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <div className="col p-2 user-item-title">
                <Link href={href}>{title}</Link>
              </div>
              <div className="col-2 p-2">{type}</div>
              <div className="col-2">
                <div className="d-flex justify-content-between p-2">
                  <span>$NT</span>
                  <span>{formatted(parseInt(item.price))}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <button
        className="btn-order-prod"
        onClick={() => {
          getItems()
          setOpenProd(!openProd)
        }}
      >
        {btnProdContent}
      </button>
    </>
  )
}
