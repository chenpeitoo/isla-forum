'use client'

import React, { useState, useEffect } from 'react'
import useSWR from 'swr'
import { useAuth } from '../../../hook/use-auth'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function GetPosts(params) {
  const userID = useAuth().user.id

  // 開抓
  const postsAPI = params
    ? `http://localhost:3005/api/forum/posts/home?${params}&userID=${userID}`
    : `http://localhost:3005/api/forum/posts/home?userID=${userID}`
  const { data, isLoading, error, mutate } = useSWR(postsAPI, fetcher)

  // 新增 minimum loading 狀態
  const [showLoading, setShowLoading] = useState(true)
  useEffect(() => {
    if (!isLoading) {
      // 至少顯示 600ms
      const timer = setTimeout(() => setShowLoading(false), 400)
      return () => clearTimeout(timer)
    } else {
      setShowLoading(true)
    }
  }, [isLoading])

  const isResultExist = data?.isResultExist
  const otherPosts = data?.otherPosts

  // 整理posts內的liked_user_ids和saved_user_ids
  let originPosts = data?.data
  if (Array.isArray(originPosts)) {
    originPosts = originPosts.map((post) => {
      return {
        ...post,
        liked_user_ids: post.liked_user_ids
          ? post.liked_user_ids.split(',').map(Number)
          : [],
        saved_user_ids: post.saved_user_ids
          ? post.saved_user_ids.split(',').map(Number)
          : [],
      }
    })
  }
  const posts = isResultExist ? originPosts : otherPosts

  return { posts, isResultExist, showLoading, error, mutate }
}
