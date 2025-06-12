'use client'

import React, { useState, useEffect, useId } from 'react'
import ContentLoader from 'react-content-loader'

export default function PostDetailLoader({ viewHeight }) {
  const id = useId()
  return (
    <ContentLoader
      speed={2}
      width={700}
      height={viewHeight}
      viewBox="0 0 700 245"
      backgroundColor="#dfdfdf"
      foregroundColor="#eeeeed"
      uniqueKey={id}
      // {...props}
    >
      {/* title */}
      <rect x="0" y="5" rx="13" ry="13" width="40" height="25" />
      <rect x="48" y="0" rx="18" ry="18" width="224" height="36" />

      {/* author */}
      <circle cx="13" cy="50" r="12" />
      <rect x="32" y="42" rx="8" ry="8" width="66" height="16" />
      <rect x="112" y="42" rx="8" ry="8" width="36" height="16" />

      {/* content */}
      <rect x="0" y="70" rx="8" ry="8" width="261" height="16" />
      <rect x="0" y="92" rx="8" ry="8" width="280" height="16" />
      <rect x="0" y="114" rx="8" ry="8" width="241" height="16" />
      <rect x="0" y="136" rx="8" ry="8" width="310" height="16" />
      <rect x="0" y="158" rx="8" ry="8" width="273" height="16" />
    </ContentLoader>
  )
}
