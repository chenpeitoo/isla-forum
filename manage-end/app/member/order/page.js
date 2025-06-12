'use client'

import '../_component/_style.css/form.css'
import { useEffect } from 'react'
// import OrderList from '../_component/order-list'

export default function OrderPage() {
  useEffect(() => {
    const token = localStorage.getItem('jwtToken') || null
    if (!token) return
    // async function getOrder() {
    //   try {
    //     const token = localStorage.getItem('jwtToken')

    //     const response = await fetch(
    //       'http://localhost:3005/api/member/order',
    //       {
    //         method: 'GET',
    //         headers: { Authorization: `Bearer ${token}` },
    //       }
    //     )
    //   } catch (err) {
    //     console.log(err)
    //   }
    // }
    // getOrder()
  }, [])
  return (
    <>
      <div className="user-content">
        <h3>訂單詳細資料</h3>
      </div>
    </>
  )
}
