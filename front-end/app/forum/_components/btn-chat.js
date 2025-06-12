'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../hook/use-auth'
import { UseDirectToLogin } from '../_hooks/useDirectToLogin'
import { useRouter } from 'next/navigation'

export default function ComponentsButtonChat() {
  const router = useRouter()
  const { user } = useAuth()
  const userID = user.id
  const isAuth = user.id !== 0
  const handleDirectLogin = UseDirectToLogin({ isAuth })
  return (
    <>
      <button
        className="button-triggerable default px-2 py-1 flex-grow-0 flex-grow-lg-0 w-auto color-isla-white rounded-3 text-nowrap fw-medium fs14"
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          isAuth && router.push('/forum/chat')
        }}
      >
        聊天
      </button>
    </>
  )
}
