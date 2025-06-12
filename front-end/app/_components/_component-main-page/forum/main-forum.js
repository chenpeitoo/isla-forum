'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import ComponentsBtnLikedSaved from '../../../forum/_components/btn-liked-saved'

export default function MainForum({
  number = '',
  forumTitle = '',
  forumContent = '',
  img_url = null,
  btnLikedActive = '',
  btnLikedCount = '',
  postID = '',
  mutate = '',
  btnSavedActive = '',
  btnSavedCount = '',
}) {
  const router = useRouter()
  return (
    <>
      <div
        className="col d-lg-block d-none sub-block p-4"
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
        <div className="row row-cols-2 main-forum w-100 h-100">
          <div className="img-container p-0 rounded-3 overflow-hidden">
            <div
              className="col overflow-hidden rounded-3 h-100 img-html"
              dangerouslySetInnerHTML={{ __html: img_url }}
            />
          </div>
          <div className="d-flex flex-column justify-content-center ps-4 gap-3">
            <div className="h4 text-primary forum-title">{forumTitle}</div>
            <div className="h6 fw-normal forum-content">{forumContent}</div>
            <div className="evaluates d-flex fs14 ms-n1">
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
      </div>
    </>
  )
}
