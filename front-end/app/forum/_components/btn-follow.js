'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../../../hook/use-auth'
import useSWR from 'swr'
import { UseDirectToLogin } from '../_hooks/useDirectToLogin'
import { toast } from 'react-toastify'
import ConfirmModal from './confirmModal'

export default function ComponentsButtonFollowing({ isFollow, handleFollow }) {
  const { user } = useAuth()
  const userID = user.id
  const isAuth = user.id !== 0
  const handleDirectLogin = UseDirectToLogin({ isAuth })

  return (
    <>
      <button
        className={`button-triggerable py-1 flex-grow-1 color-isla-white rounded-3 text-nowrap fw-medium fs14 ${isFollow && isAuth ? 'active' : 'default'} btn-follow`}
        type="button"
        data-bs-toggle={isAuth && isFollow ? 'modal' : ''}
        data-bs-target="#confirmModal"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          !isAuth && handleDirectLogin('')
          isAuth && !isFollow && handleFollow()
        }}
      >
        {isFollow && isAuth ? '追蹤中' : '追蹤'}
      </button>
    </>
  )
}
