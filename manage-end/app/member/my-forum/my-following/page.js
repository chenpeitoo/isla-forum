'use client'

import React, { useState, useEffect } from 'react'
// import ComponentsAuthorInfo from '@/app/forum/_components/author-info'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import FollowingCard from './following-card'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function MyPostPage(props) {
  // const router = useRouter()
  // const userID = 1
  // const fetcher = (...arg) => fetch(...arg).then((res) => res.json())
  // const postsAPI = 'http://localhost:3005/api/forum/posts/my-following'
  // const { data, isLoading, error, mutate } = useSWR(postsAPI, fetcher)
  // if (error) {
  //   console.log(error)
  //   return (
  //     <main className="main col col-10 col-xl-8 d-flex flex-column align-items-center">
  //       連線錯誤
  //     </main>
  //   )
  // }
  // // console.log(data)
  // const posts = data?.status === 'success' ? data?.data : []
  // if (isLoading) {
  //   return (
  //     <>
  //       <main className="main col col-10 col-xl-8 d-flex flex-column align-items-center">
  //         isLoading
  //       </main>
  //     </>
  //   )
  // }
  // if (posts.length === 0) {
  //   return (
  //     <>
  //       <main className="main col col-10 col-xl-8 d-flex flex-column align-items-center">
  //         無文章資料
  //       </main>
  //     </>
  //   )
  // }

  const { data, isLoading, error, mutate } = useSWR(
    `http://localhost:3005/api/forum/posts/my-following`,
    fetcher
  )
  if (error) {
    return <></>
  }
  if (isLoading) {
    return <></>
  }
  const followings = data.data
  console.log(followings)
  return (
    <>
      <div className="body">
        <div className="my-following d-flex flex-column gap-3 w-100 rounded-3 px-4 py-3 bg-pure-white card-border shadow-forum">
          <div className="my-following-header d-flex align-items-center justify-content-sm-between justify-content-center flex-wrap">
            <div className="fs32 fw-bold text-nowrap">我的追蹤</div>
            <Link
              className="text-main px-3 py-2 rounded-pill text-nowrap"
              href={'/forum'}
            >
              <i className="bi bi-box-arrow-left me-2"></i>
              回到社群
            </Link>
          </div>
          <div className="my-following-main d-flex flex-lg-column flex-row flex-wrap gap-3">
            {followings.map((f, i) => {
              return (
                <>
                  <FollowingCard
                    key={i}
                    cardHref={`/forum/profile/${f.id}`}
                    imgSrc={f.ava_url}
                    imgAlt={f.nick}
                    imgClassWidth="50"
                    nick={f.nickname}
                  />
                </>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
