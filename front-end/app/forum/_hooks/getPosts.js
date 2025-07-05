'use client'

import { useState, useEffect } from 'react'
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((res) => res.json())

// 發佈、更新文章也需要mutate更新畫面，因而拆成共用元件
export default function GetPosts(params) {
  // 開抓
  const postsAPI = `http://localhost:3005/api/forum/posts/home?${params}`
  const { data, isLoading, error, mutate } = useSWR(postsAPI, fetcher)
  console.log(data)

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

  const posts = data?.data?.posts
  const otherPosts = data?.data?.otherPosts
  return { posts, otherPosts, showLoading, error, mutate }
}
