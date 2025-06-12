'use client'

import React, { useState } from 'react'
import OrderProdList from './_component/order-prod-list'
import './_style/order-list.css'
// ==== method ====
import { formatted } from '@/app/member/_method/method'

export default function OrderList({
  order_number,
  created_at = '',
  status = '',
  total_price = '',
  shipping_method = '',
  payment_method = '',
  order_id = 0,
}) {
  if (total_price) {
    total_price = total_price.split('.')[0]
  }
  if (status) {
    switch (status) {
      case 'pending':
        status = '請等待'
        break
      case 'completed':
        status = '已完成'
        break
    }
    total_price = total_price.split('.')[0]
  }
  const orderTable = {
    訂單編號: order_number,
    購買日期: created_at,
    訂單狀態: status,
    結帳金額: '$NT ' + formatted(parseInt(total_price)),
    取貨方式: shipping_method,
    付款方式: payment_method,
  }
  const [openOrder, setOpenOrder] = useState(false)
  const btnOrderContent = openOrder ? '闔上' : '展開'
  const orderOpenClass = openOrder ? '' : 'close-order'
  return (
    <>
      <div
        className={'d-flex flex-column justify-content-center w-100 order-list'}
      >
        <div
          className={
            'd-flex flex-md-row flex-column overflow-hidden w-100' +
            ' ' +
            orderOpenClass
          }
        >
          {/* ==== 訂單列表 ==== */}
          {Object.keys(orderTable).map((key, i) => {
            return (
              <div className="order-col" key={i}>
                <div className="order-index">{key}</div>
                <div className="order-content">{orderTable[`${key}`]}</div>
              </div>
            )
          })}
        </div>
        {/* ==== 訂單的詳細品項清單 ==== */}
        <OrderProdList order_id={order_id} />
        {/* ==== 展開品項詳細清單的按鈕 ==== */}
        <button
          className="d-md-none d-block btn-order"
          onClick={() => {
            setOpenOrder(!openOrder)
          }}
        >
          {btnOrderContent}
        </button>
      </div>
    </>
  )
}
