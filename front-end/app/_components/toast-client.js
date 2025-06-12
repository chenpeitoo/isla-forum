'use client'

import { ToastContainer } from 'react-toastify'

export default function ToastClient() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      toastClassName="custom-toast"
      style={{ marginTop: '70px', zIndex: 9999 }} // 根據 header 高度調整 marginTop
    />
  )
}
