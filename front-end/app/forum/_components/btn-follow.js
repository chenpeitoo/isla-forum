'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../hook/use-auth'
import useSWR from 'swr'
import { useDirectToLogin } from '../_hooks/useDirectToLogin'

export default function ComponentsButtonFollowing({ isFollow }) {
  const { user } = useAuth()
  const isAuth = user.id !== 0
  const handleDirectLogin = useDirectToLogin({ isAuth })

  return (
    <>
      {/* <button
        className="dropdown-item-forum px-0 py-2 button-clear color-accent"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#confirmModal"
      >
        刪除文章
      </button> */}
      <button
        className={`button-triggerable py-1 flex-grow-1 color-isla-white rounded-3 text-nowrap fw-medium fs14 ${isFollow && isAuth ? 'active' : 'default'} btn-follow`}
        type="button"
        data-bs-toggle={'modal'}
        data-bs-target="#confirmModal"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          // isAuth && handleFollow()
          if (!isAuth) handleDirectLogin('')
        }}
      >
        {isFollow && isAuth ? '追蹤中' : '追蹤'}
      </button>
    </>
  )
}
