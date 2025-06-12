'use client'
import { BsDashCircleFill, BsPlusCircleFill } from 'react-icons/bs'
import Swal from 'sweetalert2'
import cartApi from '../../utils/axios'
import React, { useState } from 'react'

export default function QuantityControler({
  id,
  max = 10,
  min = 1,
  value = 1,
  onChange = () => {},
}) {
  const [count, setCount] = useState(value)
  const [isDisable, setIsDisable] = useState(false)

  // update-localstorage
  const updateLocalStorage = (newQty) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]')
    const updated = cartItems.map((item) => {
      return item.id === id ? { ...item, quantity: newQty } : item
    })
    localStorage.setItem('cartItems', JSON.stringify(updated))
  }
  // update db
  const updateDb = async (newQty) => {
    try {
      await cartApi.patch(`/cart-items/update/${id}`, { quantity: newQty })
      console.log('更新商品 ID:', id)
      window.dispatchEvent(new Event('cart-updated'))
    } catch (error) {
      console.log('更新資料失敗', error)
    }
  }

  const minHandler = () => {
    if (count > min) {
      const newCount = count - 1
      setCount(newCount)
      setIsDisable(false)
      onChange(newCount)
      updateLocalStorage(newCount) // updated localstorage
      updateDb(newCount) // updated db
    }
  }
  const plusHandler = () => {
    if (count < max) {
      const newCount = count + 1
      setCount(newCount)
      onChange(newCount)
      updateLocalStorage(newCount) // updated localstorage
      updateDb(newCount) // updated db
    } else {
      Swal.fire({
        icon: 'warning',
        title: '庫存不足',
        text: '如需大量採購，請聯絡客服協助您處理。',
        showCancelButton: true,
        confirmButtonText: '聯絡客服',
        cancelButtonText: '我知道了',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = 'mailto: isla.supple@isla.com'
        } else {
          setIsDisable(true)
        }
      })
    }
  }
  return (
    <div className="d-flex justify-content-center align-items-center ">
      <button
        className="btn border-0 ps-0"
        onClick={minHandler}
        disabled={count <= min}
      >
        <BsDashCircleFill className="text-subtext" />
      </button>
      <span>{count}</span>
      <button
        className="btn border-0"
        onClick={plusHandler}
        disabled={isDisable}
      >
        <BsPlusCircleFill className="text-subtext" />
      </button>
    </div>
  )
}
