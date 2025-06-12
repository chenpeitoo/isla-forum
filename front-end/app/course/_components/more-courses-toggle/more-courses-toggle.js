'use client'

import React, { useEffect } from 'react'
import './more-courses-toggle.css'
import { useAuth } from '@/hook/use-auth'

export default function MoreCoursesToggle({
  isExpanded = 0,
  onToggle = '',
  id = 0,
  toggleFavorite = 0,
  cardRef = '',
}) {
  const { user } = useAuth()

  useEffect(() => {
    const pending = localStorage.getItem('pendingExperienceFavorite')
    if (user?.id && String(pending) === String(id)) {
      localStorage.removeItem('pendingExperienceFavorite')
      toggleFavorite(true)
      setTimeout(() => {
        cardRef?.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }, 300)
    }
  }, [user, id, toggleFavorite, cardRef])

  return (
    <button
      className="more-courses-toggle d-flex align-items-center"
      onClick={onToggle}
      style={{
        cursor: 'pointer',
        border: 'none',
        background: 'transparent',
        fontWeight: 'bold',
        fontSize: '1.2rem',
      }}
    >
      {isExpanded ? '收起課程' : '更多課程'}
      <i
        className="bx bx-chevron-down fs-4 ms-1"
        style={{
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s',
        }}
      />
    </button>
  )
}
