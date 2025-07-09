'use client'

import React, { useState, useEffect } from 'react'
import ComponentsAuthorInfo from '@/app/forum/_components/author-info'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import '@/app/forum/_components/forum.css'
import Link from 'next/link'
import ComponentsBtnLikedSaved from '@/app/forum/_components/btn-liked-saved'
import ComponentsPostCard from '@/app/forum/_components/post-card'
import { useAuth } from '../../../../hook/use-auth'
import PostLoader from '../../../forum/_components/loader-post'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function MyPostPage() {
  const { user } = useAuth() //NOTE
  const userID = user.id

  const postsAPI = `${process.env.NEXT_PUBLIC_API_URL}/api/forum/posts/my-post?userID=${userID}`
  const { data, isLoading, error, mutate } = useSWR(postsAPI, fetcher)
  const posts = data?.status === 'success' ? data?.data : []
  // console.log(posts)

  return (
    <>
      <div className="body my-forum">
        <div className="my-post-header d-flex align-items-center px-4 py-3">
          <div className="me-auto fs32 fw-bold">我的文章</div>
          <Link
            className="text-main px-3 py-2 rounded-pill bg-hovering-gray"
            href={'/forum'}
          >
            <i className="bi bi-box-arrow-left me-2"></i>
            回到論壇
          </Link>
        </div>
        <div className="posts d-flex flex-column gap-3 w-100 no-scroll-bar ">
          {error ? (
            <main className="main col col-10 d-flex flex-column align-items-start">
              連線錯誤，重新試試看吧
            </main>
          ) : isLoading ? (
            Array(5)
              .fill(1)
              .map((v, i) => <PostLoader key={i} />)
          ) : Array.isArray(posts) && posts.length === 0 ? (
            <main className="main col col-10 col-xl-8 d-flex flex-column align-items-center">
              無文章資料
            </main>
          ) : (
            posts?.map((post) => {
              return (
                <ComponentsPostCard
                  key={post.id}
                  postID={post.id}
                  postTitle={post.title}
                  postCateName={post.cate_name}
                  productCateName={post.prodcut_cate_name}
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
            })
          )}
        </div>
      </div>
    </>
  )
}
