'use client'

import React, { useState, useEffect } from 'react'

export function UseCommentSubmit({ postID, mutate }) {
  return async (e, userID, parentID, scrollRef) => {
    const content = e.target.value
    const url = `http://localhost:3005/api/forum/comment`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        userID: userID,
        postID: postID,
        parentID: parentID,
      }),
    })
    if (!res.ok) {
      throw new Error('獲取資料錯誤')
    }
    const result = await res.json()

    if (result.status === 'success' && mutate) {
      await mutate()
      console.log(scrollRef)
      scrollRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
    e.target.value = ''
  }
}
