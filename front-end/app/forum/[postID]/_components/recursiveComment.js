'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import ComponentsAvatar from '../../_components/avatar'
import ComponentsBtnLikedSaved from '../../_components/btn-liked-saved'
import ComponentsSubCommentToggle from './subCommentToggle'
import { useAuth } from '../../../../hook/use-auth'
import { useParams, usePathname } from 'next/navigation'
import { UseCommentSubmit } from '../../_hooks/useCommentSubmit'
import { UseDirectToLogin } from '../../_hooks/useDirectToLogin'

export default function RecursiveComment({
  commentID = '',
  userId = '',
  userImg = '',
  userNick = '',
  content = '',
  updatedAt,
  btnActive = Boolean,
  btnCount = 0,
  editActive = Boolean,
  mutate = () => {},
  subComments = [],
  subCount = 0,
}) {
  const path = usePathname()
  const postID = useParams().postID
  const lastSubCommentRef = useRef()
  // const subInputRef = useRef()
  const { user } = useAuth()
  const isAuth = user.id !== 0
  const userIDMe = user.id
  const userNickMe = isAuth ? user.nickname : '訪客'
  const userImgMe = isAuth ? user.ava_url : 'default-avatar.jpg'
  const [isSubCommentShow, setSubCommentShow] = useState(false)
  const [isSubInputShow, setSubInputShow] = useState(false)

  const handleCommentSubmit = UseCommentSubmit({
    postID,
    mutate,
  })

  const handleDirectToLogin = UseDirectToLogin({ isAuth })

  const handleCommentDelete = () => {}

  return (
    <>
      <div className="comment-content d-flex gap-1">
        <Link href={`/forum/profile/${userId}`} className="user-avatar py-1">
          <ComponentsAvatar classWidth="32" src={userImg} alt={userNick} />
        </Link>
        <div className="comment-main d-flex flex-column flex-grow-1 gap-1 px-3 py-2 bg-gray-article rounded-4">
          <div className="comment-header d-flex align-items-start">
            <div className="author-account me-auto">
              <Link
                href={`/forum/profile/${userId}`}
                className="d-flex align-items-center gap-1 text-decoration-none fw-medium main-text-color"
              >
                {userNick}
              </Link>
            </div>
            <ComponentsBtnLikedSaved
              type="liked"
              active={btnActive}
              count={btnCount}
              postID={null}
              commentID={commentID}
              mutate={mutate}
              color="fs14"
            />
          </div>
          <div
            className="comment-text"
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
          <div className="comment-info d-flex gap-2 align-content-center fs14 sub-text-color">
            {/* <div className="comment-date">3 月 26 日 16:07</div> */}
            <div className="comment-date">{updatedAt}</div>
            <button
              href="/"
              className="reply button-clear text-decoration-none"
              onClick={() => {
                !isAuth ? handleDirectToLogin(path) : setSubInputShow((v) => !v)
              }}
            >
              <span className="fs14 sub-text-color fw-light">回覆</span>
            </button>
            <button
              className={`button-clear main-text-color ${editActive ? 'd-block' : 'd-none'} px-0`}
              onClick={handleCommentDelete}
            >
              <span className="fs14 sub-text-color fw-light">刪除</span>
            </button>
          </div>
        </div>
      </div>
      {subComments.length !== 0 && (
        <ComponentsSubCommentToggle
          isSubCommentShow={isSubCommentShow}
          setSubCommentShow={setSubCommentShow}
          subCommentsLength={subCount}
        />
      )}
      {subComments.map((subComment, i) => (
        <div
          key={i}
          className={`sub-margin ${isSubCommentShow ? 'd-flex' : 'd-none'} flex-column gap-3`}
          ref={i === subComments.length - 1 ? lastSubCommentRef : null}
        >
          {/* comment-card d-flex flex-column gap-3 py-3 bottom-stroke */}
          <RecursiveComment
            commentID={subComment.id}
            userId={subComment.user_id}
            userImg={subComment.user_img}
            userNick={subComment.nick}
            content={subComment.content}
            updatedAt={subComment.timeFormat}
            btnActive={subComment.btnActive}
            btnCount={subComment.btnCount}
            editActive={subComment.editActive}
            mutate={mutate}
            subComments={subComment.subComments}
            subCount={subComment.subCount}
          />
        </div>
      ))}
      <div
        className={`sub-input-block ${isSubInputShow ? 'd-flex' : 'd-none'}  gap-2 sub-margin`}
      >
        <ComponentsAvatar classWidth="32" src={userImgMe} alt={userNickMe} />
        <input
          // ref={subInputRef}
          className="sub-input bg-gray-article border-0 rounded-pill px-3 w-100"
          placeholder={`回覆 ${userNick}`}
          type="text"
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              e.target.value !== '' &&
              !e.nativeEvent.isComposing
            ) {
              handleCommentSubmit(e, userIDMe, commentID, lastSubCommentRef)
              mutate()
              setSubCommentShow(true)
              setSubInputShow(false)
            }
          }}
        />
      </div>
    </>
  )
}
