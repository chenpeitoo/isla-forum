'use client'

import React, { useState, useEffect } from 'react'
import ComponentsSearchBar from './search-bar'

export default function ComponentsSearchButton({
  postCateItems = [],
  productCateItems = [],
  handleAsideSearchChange = () => {},
}) {
  return (
    <>
      <button
        className="d-flex d-xl-none justify-content-center align-items-center gap-1 ms-1 p-2 rounded-pill sub-text-color border-0 text-nowrap button-clear bg-hovering-gray"
        type="button"
        // data-bs-toggle="dropdown"
        // aria-expanded="false"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasWithBothOptions"
        aria-controls="offcanvasWithBothOptions"
      >
        <i className="bi bi-search"></i>
        分類
      </button>
      <div
        className="offcanvas offcanvas-end search-bar-offcanvas px-5"
        data-bs-scroll="true"
        tabIndex={-1}
        id="offcanvasWithBothOptions"
        aria-labelledby="offcanvasWithBothOptionsLabel"
      >
        <div className="search-bar-wrapper overflow-scroll no-scroll-bar">
          <ComponentsSearchBar
            postCateItems={postCateItems}
            productCateItems={productCateItems}
            handleAsideSearchChange={handleAsideSearchChange}
          />
        </div>
      </div>
    </>
  )
}
