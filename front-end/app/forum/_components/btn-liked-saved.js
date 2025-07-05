'use client'

import React, { useState, useEffect, act } from 'react'
import { useAuth } from '../../../hook/use-auth'
import { ClimbingBoxLoader } from 'react-spinners'
import { useParams, useRouter } from 'next/navigation'
import { UseDirectToLogin } from '../_hooks/useDirectToLogin'

// FIXME 讚數是否前端修改即可？
// FIXME 點擊後被告知確認，但取消後仍然加上資料

export default function ComponentsBtnLikedSaved({
  type = '',
  active = Boolean,
  count = '',
  postID = '',
  commentID = '',
  // userID = '',
  mutate = () => {},
  color = '',
}) {
  const router = useRouter()
  const { user } = useAuth()
  const userID = user.id
  const isAuth = user.id !== 0
  const handleDirectToLogin = UseDirectToLogin({ isAuth })
  const iconClass =
    type === 'liked'
      ? active
        ? 'bi-heart-fill main-color'
        : 'bi-heart'
      : active
        ? 'bi-bookmark-fill badge-color'
        : 'bi-bookmark'
  return (
    <>
      <button
        className={`evaluate saved px-2 py-1 border-0 rounded-3 d-flex align-items-center ${color}`}
        onClick={async (e) => {
          e.preventDefault()
          e.stopPropagation()
          handleDirectToLogin('/forum')
          if (isAuth) {
            const method = active ? 'DELETE' : 'POST'
            const res = await fetch(
              `http://localhost:3005/api/forum/liked-saved/${type}`,
              {
                method: method,
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userID, postID, commentID }),
              }
            )
            const json = await res.json()
            if (json.status === 'success') {
              mutate()
            }
          }
        }}
      >
        <i className={`bi ${iconClass}  me-1`} />
        {count}
      </button>
    </>
  )
}
