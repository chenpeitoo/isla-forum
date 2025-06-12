'use client'

import React, { useState, useEffect } from 'react'

export default function ComponentsSubCommentToggle({
  isSubCommentShow = Boolean,
  setSubCommentShow = () => {},
  subCommentsLength,
}) {
  // console.log(subCommentsLength)
  return (
    <>
      {/* <div className="comment-more d-flex flex-column gap-3">  */}
      <button
        className="sub-comment-toggle d-flex sub-margin px-0 text-decoration-none fs14 sub-text-color button-clear"
        onClick={() => {
          setSubCommentShow((v) => !v)
        }}
      >
        <span className="d-inline">
          —— {isSubCommentShow ? '隱藏留言' : `查看${subCommentsLength}則留言`}
        </span>
      </button>
      {/* </div>   */}
    </>
  )
}
