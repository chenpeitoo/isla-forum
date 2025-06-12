'use client'

import React, { useState, useEffect, useRef } from 'react'
import ComponentsAuthorInfo from './author-info'
import ComponentsBtnLikedSaved from './btn-liked-saved'
import { useRouter } from 'next/navigation'
import UseDragScroll from '../_hooks/useDragScroll'

export default function ComponentsPostCard({
  postID = '',
  postTitle = '',
  postCateName = '',
  postContent = '',
  authorID = '',
  width = '',
  src = '',
  alt = '',
  fontSize = '',
  color = '',
  updatedAt,
  authorName = '',
  btnLikedActive = Boolean,
  btnSavedActive = Boolean,
  btnLikedCount = '',
  btnSavedCount = '',
  commentCount = 0,
  mutate = () => {},
}) {
  const router = useRouter()
  const sliderRef = useRef()
  const { handlePointerDown, handlePointerMove, stopDrag } =
    UseDragScroll(sliderRef)

  // 日期格式
  const date = new Date(updatedAt)
  const time = date.getTime()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const oneDay = 24 * 60 * 60 * 1000
  const todayNow = new Date()
  const todayMidTime = new Date(
    todayNow.getFullYear(),
    todayNow.getMonth(),
    todayNow.getDate()
  ).getTime()

  let dateFormat
  if (Date.now() - time <= 120000) {
    dateFormat = '剛剛'
  } else if (time >= todayMidTime) {
    dateFormat = date.toLocaleTimeString('zh-TW', {
      hour: 'numeric',
      minute: 'numeric',
    })
  } else if (time >= todayMidTime - oneDay) {
    const time = date.toLocaleTimeString('zh-TW', {
      hour: 'numeric',
      minute: 'numeric',
    })
    dateFormat = `昨日 ${time}`
  } else {
    dateFormat = `${month}月${day}日`
  }

  // 整理卡片顯示
  const contentText = postContent
    // .replace('<br>', '')
    .replace(/<img\b[^>]*>/g, '')
    .replace(/<br>/g, '')
  // .replace(/<div>[<br>]*<\/div>/, '')
  // .replace('<div></div>', '')
  const contentImg = postContent.match(/<img\b[^>]*>/g) || []
  const contentImgSm = contentImg.map((v) =>
    v.replace('w-50', 'w-100 h-100 object-fit-cover rounded-3')
  )

  // console.log(commentCount)

  return (
    <>
      <div
        className="post-home d-flex flex-column gap-1 py-3 rounded-3 shadow-forum bg-pure-white card-border"
        key={postID}
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
        <div className="d-flex align-items-center px-4 mb-1">
          <ComponentsAuthorInfo
            authorID={authorID}
            width={width}
            src={src}
            alt={alt}
            fontSize={fontSize}
            color={color}
            authorName={authorName}
          />
          <div className="updated-at sub-text-color fs12 fw-light">
            {dateFormat}
          </div>
        </div>
        <div className="post-header d-flex px-4">
          <div className="post-tag px-2 py-1 me-2 rounded-pill fs12 text-nowrap bg-light-hover main-color">
            {postCateName}
          </div>
          <div className="post-title fw-medium text-truncate main-text-color">
            {postTitle}
          </div>
        </div>
        <div
          className="post-content text-truncate fs14 sub-text-color px-4"
          dangerouslySetInnerHTML={{
            __html: contentText.replace('<br/>', ' ').slice(0, 80),
          }}
        />
        <div
          ref={sliderRef}
          className="imgs d-flex gap-3 overflow-auto ps-4 no-scroll-bar"
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation()
          }}
          onKeyDown={() => {}}
          onPointerDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handlePointerDown(e)
          }}
          onPointerMove={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handlePointerMove(e)
          }}
          onPointerUp={stopDrag}
          onPointerLeave={stopDrag}
        >
          {contentImgSm.map((v, i) => (
            <div
              key={i}
              className="img flex-shrink-0 rounded-3"
              dangerouslySetInnerHTML={{ __html: v }}
            />
          ))}
        </div>
        <div className="evaluates d-flex fs14 ms-n4 px-4">
          <ComponentsBtnLikedSaved
            type={'liked'}
            active={btnLikedActive}
            count={btnLikedCount}
            postID={postID}
            // userID={userID}
            mutate={mutate}
          />
          <button className="evaluate comment px-2 py-1 border-0 rounded-3 d-flex align-items-center bg-pure-white">
            <i className="bi bi-chat me-1" />
            {commentCount}
          </button>
          <ComponentsBtnLikedSaved
            type={'saved'}
            active={btnSavedActive}
            count={btnSavedCount}
            postID={postID}
            // userID={userID}
            mutate={mutate}
          />
        </div>
      </div>
    </>
  )
}
