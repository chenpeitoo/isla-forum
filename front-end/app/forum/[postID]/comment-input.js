'use client'

import React, { useState, useEffect } from 'react'
import ComponentsAvatar from '../_components/avatar'
import { useAuth } from '../../../hook/use-auth'
import ComponentsBtnLikedSaved from '../_components/btn-liked-saved'
import { useParams, usePathname } from 'next/navigation'
import { UseCommentSubmit } from '../_hooks/useCommentSubmit'
import { UseDirectToLogin } from '../_hooks/useDirectToLogin'
import { ClimbingBoxLoader } from 'react-spinners'

export default function CommentInput({
  mutate = () => {},
  parentID = null,
  lastCommentRef,
}) {
  const path = usePathname()
  const { user } = useAuth()
  const isAuth = user.id !== 0
  const userID = Number(user.id)
  const userNick = isAuth ? user.nickname : '訪客'
  const userImg = isAuth ? user.ava_url : 'default-avatar.jpg'
  const postID = useParams().postID
  // console.log({ userID, postID, parentID })
  console.log(path)

  const handleCommentSubmit = UseCommentSubmit({
    postID,
    mutate,
  })
  const handleDirectToLogin = UseDirectToLogin({ userID })

  // const handleCommentSubmit = async (e) => {
  //   const content = e.target.value
  //   const url = `http://localhost:3005/api/forum/comment`
  //   const res = await fetch(url, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ content, userID, postID, parentID }),
  //   })
  //   if (!res.ok) {
  //     throw new Error('獲取資料錯誤')
  //   }
  //   const result = await res.json()
  //   console.log(result)

  //   if (result.status === 'success' && mutate) {
  //     await mutate()
  //     window.scrollTo({
  //       top: document.body.scrollHeight,
  //       behavior: 'smooth',
  //     })
  //   }
  // }
  return (
    <>
      <div className="comment-input-block position-sticky bottom-0 d-flex align-items-center gap-2 px-4 py-2 bg-pure-white">
        <div className="ps-1">
          <ComponentsAvatar src={userImg} alt={userNick} classWidth="32" />
        </div>
        <input
          className="comment-input w-100 bg-gray-article rounded-pill px-3"
          placeholder={`${userNick} 留言⋯⋯`}
          type="text"
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              e.target.value !== '' &&
              !e.nativeEvent.isComposing
            ) {
              // setContent(e.target.value)
              console.log(isAuth)
              !isAuth && handleDirectToLogin(path)
              handleCommentSubmit(e, userID, null, lastCommentRef)
            }
          }}
        />
      </div>
    </>
  )
}
