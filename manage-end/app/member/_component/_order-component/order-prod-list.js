'use client'

import React, { useState, useEffect } from 'react'

export default function OrderProdList(props) {
  const [openProd, setOpenProd] = useState(false)
  const btnProdContent = openProd ? '收起明細' : '展開明細'
  const prodListControl = openProd ? '' : 'closeProdList'
  return (
    <>
      <div
        className={
          'd-flex flex-md-row flex-column justify-content-between align-items-center overflow-hidden prodList' +
          ' ' +
          prodListControl
        }
      >
        <div className="prodImg"></div>
        <div>Heart Crush Bare Glaze</div>
        <div>type</div>
        <div>$1440</div>
      </div>
      <button
        className="btn-order-prod"
        onClick={() => {
          setOpenProd(!openProd)
        }}
      >
        {btnProdContent}
      </button>
    </>
  )
}
