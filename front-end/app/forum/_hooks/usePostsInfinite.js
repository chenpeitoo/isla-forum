'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import useSWRInfinite from 'swr/infinite'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function usePostsInfinite(queryObj) {
  const params = queryObj.toString()
  // const tabNumber = Number(queryObj.get('tab'))
  // const hasTabSwitch = useRef(false)
  // useEffect(() => {
  //   hasTabSwitch.current = !hasTabSwitch.current
  // }, [tabNumber])

  // SWR 預設機制會把第一頁的 response 當作 previous 傳給 getKey(1, previous)。
  const getKey = (pageIdx, previous) => {
    const lastCursor = previous ? previous.data?.lastCursor : null
    if (previous && !lastCursor) return null //最後一組資料則不fetch

    const cursorClause = lastCursor
      ? `&cursor=${lastCursor.popular}&postID=${lastCursor.id}`
      : '&cursor=null&postID=null'

    const api = `${process.env.NEXT_PUBLIC_API_URL}/api/forum/posts/home?${params === '' ? 'tab=1' : params}${cursorClause}`

    // console.log('💥triggerd getPostsInfinite', {lastCursor,api,params,})
    return api
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
