'use client'

import React, { useState, useEffect } from 'react'
import useSWRInfinite from 'swr/infinite'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function GetPostsInfinite(params) {
  console.log(params.toString())
  // SWR 預設機制會把第一頁的 response 當作 previous 傳給 getKey(1, previous)。
  const getKey = (pageIdx, previous) => {
    if (previous && !previous.data.lastCursor) return null //最後一組資料則不fetch

    const cursor = previous?.data?.lastCursor
      ? `cursor=${previous.data.lastCursor.popular}&postID=${previous.data.lastCursor.id}`
      : ''
    return `http://localhost:3005/api/forum/posts/home?${cursor}&${params}`
  }

  const { data, error, isLoading, mutate, size, setSize } = useSWRInfinite(
    getKey,
    fetcher,
    {
      revalidateFirstPage: false, // 避免無意義重撈 QU
      suspense: false, //QU
    }
  )

  const posts = data ? data.flatMap((page) => page?.data?.posts ?? []) : []
  const lastCursor = data?.at(-1)?.data?.lastCursor?.popular

  // 新增 minimum loading 狀態
  const [showLoading, setShowLoading] = useState(true)
  useEffect(() => {
    if (!isLoading) {
      // 至少顯示 600ms
      const timer = setTimeout(() => setShowLoading(false), 300)
      return () => clearTimeout(timer)
    } else {
      setShowLoading(true)
    }
  }, [isLoading])

  const hasMore = lastCursor !== undefined

  return { posts, size, setSize, showLoading, error, mutate, hasMore }
}
