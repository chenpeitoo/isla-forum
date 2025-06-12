'use client'

import React, { useState, useEffect } from 'react'

export default function BrandSelect({
  tabSwitch = '',
  setTabSwitch = () => {},
  navBrands = [],
}) {
  return (
    <>
      <div className="d-lg-none d-block">
        <select
          name="brands"
          className="form-control text-center px-1"
          onChange={(e) => {
            setTabSwitch(e.target.value)
          }}
        >
          {navBrands.map((brand, i) => {
            return (
              <option key={i} value={i + 1}>
                {brand}
              </option>
            )
          })}
        </select>
      </div>
    </>
  )
}
