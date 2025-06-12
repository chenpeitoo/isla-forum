'use client'

import React, { useState, useEffect } from 'react'
import ComponentsAvatar from './avatar'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ComponentsAuthorInfo({
  authorID = '',
  width = '',
  src = '',
  fontSize = '',
  color = '',
  authorName = '',
}) {
  const router = useRouter()
  const handleNavigate = (e) => {
    e.stopPropagation() //卡片從Link換成div role=link後，要用這個才能止住事件冒泡
    e.preventDefault()
    router.push(`/forum/profile/${authorID}`)
  }

  return (
    <>
      <button
        className="author-info d-inline-flex align-items-center gap-2 px-0 button-clear me-auto"
        onClick={handleNavigate}
      >
        <ComponentsAvatar classWidth={width} src={src} alt={authorName} />
        <span
          style={{ fontSize: fontSize + 'px', color: color }}
          className="author-info-name text-truncate"
        >
          {authorName}
        </span>
      </button>
    </>
  )
}
