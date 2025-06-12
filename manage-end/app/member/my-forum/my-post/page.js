'use client'

import React, { useState, useEffect } from 'react'
// import ComponentsAuthorInfo from '@/app/forum/_components/author-info'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
// import ComponentsBtnLikedSaved from '@/app/forum/_components/btn-liked-saved'
// import ComponentsPostCard from '@/app/forum/_components/post-card'
import { useAuth } from '../../../../hook/use-auth'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function MyPostPage(props) {
  const router = useRouter()
  const { user, isAuth } = useAuth() //NOTE
  const userID = user.id
  const userNick = user.nickname

  const postsAPI = `http://localhost:3005/api/forum/posts/my-post?userID=${userID}`
  const { data, isLoading, error, mutate } = useSWR(postsAPI, fetcher)
  let posts = data?.data
  console.log(posts)
  if (error) {
    console.log(error)
    return (
      <main className="main col col-10 d-flex flex-column align-items-start">
        連線錯誤
      </main>
    )
  }
  if (isLoading) {
    return (
      <>
        <main className="main col col-10 col-xl-8 d-flex flex-column align-items-center">
          isLoading
        </main>
      </>
    )
  }
  if (Array.isArray(posts)) {
    posts = posts.map((post) => {
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
    if (posts.length === 0) {
      return (
        <>
          <main className="main col col-10 col-xl-8 d-flex flex-column align-items-center">
            無文章資料
          </main>
        </>
      )
    }
  }
  return (
    <>
      <div className="body">
        <div className="my-post-header d-flex align-items-center px-4  py-3">
          <div className="me-auto fs32 fw-bold">我的文章</div>
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
                alt={post.user_nick}
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
