'use client'

import React, { useState, useEffect } from 'react'
// import ComponentsAuthorInfo from '@/app/forum/_components/author-info'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
// import ComponentsPostCard from '../../../forum/_components/post-card'

export default function MyPostPage(props) {
  const router = useRouter()
  const userID = 1
  const fetcher = (...arg) => fetch(...arg).then((res) => res.json())
  const postsAPI = 'http://localhost:3005/api/forum/posts/saved-post'
  const { data, isLoading, error, mutate } = useSWR(postsAPI, fetcher)
  if (error) {
    console.log(error)
    return (
      <main className="main col col-10 col-xl-8 d-flex flex-column align-items-center">
        連線錯誤
      </main>
    )
  }
  // console.log(data)
  const posts = data?.status === 'success' ? data?.data : []
  if (isLoading) {
    return (
      <>
        <main className="main col col-10 col-xl-8 d-flex flex-column align-items-center">
          isLoading
        </main>
      </>
    )
  }
  if (posts.length === 0) {
    return (
      <>
        <main className="main col col-10 col-xl-8 d-flex flex-column align-items-center">
          無文章資料
        </main>
      </>
    )
  }
  return (
    <>
      <div className="body">
        <div className="saved-post-header d-flex align-items-center px-4 py-3">
          <div className="me-auto fs32 fw-bold">收藏文章</div>
          <Link className="text-main px-3 py-2 rounded-pill" href={'/forum'}>
            <i className="bi bi-box-arrow-left me-2"></i>
            回到社群
          </Link>
        </div>
        <div className="posts d-flex flex-column gap-3 w-100">
          {posts?.map((post) => {
            return (
              <ComponentsPostCard
                key={post.id}
                postID={post.id}
                postTitle={post.title}
                postCateName={post.cate_name}
                postContent={post.content}
                authorID={post.user_id}
                width="21"
                src={post.user_img}
                alt={post.user_name}
                fontSize="14"
                color="var(--sub-text)"
                updatedAt={post.updated_at}
                authorName={post.user_nick}
                btnLikedActive={post.liked_user_ids.includes(userID)}
                btnSavedActive={post.saved_user_ids.includes(userID)}
                btnLikedCount={post.liked_user_ids.length}
                btnSavedCount={post.saved_user_ids.length}
                userID={userID}
                mutate={mutate}
              />
            )
          })}
        </div>
      </div>
    </>
  )
}
