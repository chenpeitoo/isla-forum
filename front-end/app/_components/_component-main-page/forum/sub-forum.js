'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ComponentsBtnLikedSaved from '../../../forum/_components/btn-liked-saved'

export default function SubForum({
  number = 0,
  postID = '',
  forumTitle = '',
  forumContent = '',
  btnLikedActive = '',
  btnLikedCount = '',
  btnSavedActive = '',
  btnSavedCount = '',
  mutate = '',
}) {
  const router = useRouter()
  return (
    <div
      className="d-flex overflow-hidden px-2 py-3 forum"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        router.push(`/forum/${postID}`)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') router.push(`/forum/${postID}`)
      }} //無障礙通用設計
      role="link"
      tabIndex={0} //可被tab鍵聚焦
      style={{ cursor: 'pointer' }}
    >
      {/* <div className="d-flex align-items-center p-2 text-primary">{number}</div> */}
      <div className="d-flex flex-column gap-2 p-1 forum-text-wrap">
        <div className="forum-title">{forumTitle}</div>
        <div
          className="forum-content d-blok text-nowrap text-truncate"
          dangerouslySetInnerHTML={{ __html: forumContent }}
        />
        <div className="evaluates d-flex fs14 ms-n4">
          <ComponentsBtnLikedSaved
            type={'liked'}
            active={btnLikedActive}
            count={btnLikedCount}
            postID={postID}
            commentID={null}
            mutate={mutate}
            color=""
          />
          <button className="evaluate comment px-2 py-1 border-0 rounded-3 d-flex align-items-center bg-pure-white">
            <i className="bi bi-chat-left me-1" />8
          </button>
          <ComponentsBtnLikedSaved
            type={'saved'}
            active={btnSavedActive}
            count={btnSavedCount}
            postID={postID}
            commentID={null}
            mutate={mutate}
            color=""
          />
        </div>
      </div>
    </div>
  )
}
