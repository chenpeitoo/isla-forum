'use client'

import React, { useState, useEffect, useId } from 'react'
import ContentLoader from 'react-content-loader'

export default function PostLoader() {
  const id = useId()
  return (
    <div className="post-home d-flex flex-column gap-1 ps-4 py-3 rounded-3 shadow-forum bg-pure-white card-border">
      <div className="overflow-hidden">
        <ContentLoader
          speed={2}
          width={700}
          height={245}
          viewBox="0 0 700 245"
          backgroundColor="#dfdfdf"
          foregroundColor="#eeeeed"
          uniqueKey={id}
          // {...props}
        >
          {/* author */}
          <circle cx="13" cy="12" r="12" />
          <rect x="32" y="3" rx="8" ry="8" width="66" height="16" />

          {/* title */}
          <rect x="0" y="30" rx="10" ry="10" width="40" height="20" />
          <rect x="48" y="30" rx="10" ry="10" width="224" height="20" />
          {/* content */}
          <rect x="0" y="60" rx="8" ry="8" width="261" height="16" />
          {/* 相片 */}
          <rect x="0" y="88" rx="16" ry="16" width="131" height="120" />
          <rect x="139" y="88" rx="16" ry="16" width="131" height="120" />
          <rect x="276" y="88" rx="16" ry="16" width="131" height="120" />
          <rect x="414" y="88" rx="16" ry="16" width="131" height="120" />
          <rect x="552" y="88" rx="16" ry="16" width="131" height="120" />
          {/* evaluate */}
          <rect x="0" y="225" rx="8" ry="8" width="89" height="16" />
        </ContentLoader>
      </div>
    </div>
  )
}
