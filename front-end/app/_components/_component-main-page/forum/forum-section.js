'use client'

import React, { useState, useEffect } from 'react'
import './_style/forum.css'
import Componentstab from '../../tab'
import MainForum from './main-forum'
import SubForum from './sub-forum'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { useAuth } from '@/hook/use-auth'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function ForumSection(props) {
  const router = useRouter()
  const userID = useAuth().user.id
  const { data, isLoading, error, mutate } = useSWR(
    `http://localhost:3005/api/forum/homePage`,
    fetcher
  )
  if (error) {
    return <>未連接至資料庫</>
  }
  if (isLoading) {
    return <>資料載入中</>
  }
  const posts = data.data

  const postsFormat = posts.map((p) => ({
    ...p,
    content: p.content
      .replace(/<img\b[^>]*>/g, '')
      .replace(/<\/?span>/g, '')
      .replace(/<br\/?>/g, ' ')
      .slice(0, 80),
  }))
  console.log(postsFormat)

  const firstImg = posts[0].content
    .replace('w-50', 'object-fit-cover w-100 h-100')
    .match(/<img\b[^>]*>/)[0]

  return (
    <>
      <div className="d-flex flex-column align-items-center gap-5">
        <div className="d-flex flex-column align-items-center gap-4">
          <h3>Top 文章</h3>
          <Componentstab cates={['熱門', '最新']} />
        </div>
        <div className="row row-cols-lg-2 row-cols-1 gx-5 w-100">
          <MainForum
            number={1}
            forumTitle={postsFormat[0].title}
            forumContent={postsFormat[0].content}
            img_url={firstImg}
            btnLikedActive={postsFormat[0].liked_user_ids.includes(userID)}
            btnLikedCount={postsFormat[0].liked_user_ids.split(',').length}
            btnSavedActive={postsFormat[0].saved_user_ids.includes(userID)}
            btnSavedCount={postsFormat[0].saved_user_ids.split(',').length}
            postID={postsFormat[0].id}
            mutate={mutate}
          />
          <div className="col">
            {postsFormat.map((post, i) => {
              return (
                <div key={i} className={`${i === 0 && 'd-lg-none'} sub-block`}>
                  <SubForum
                    number={i + 1}
                    postID={post.id}
                    forumTitle={post.title}
                    forumContent={post.content}
                    btnLikedActive={post.liked_user_ids.includes(userID)}
                    btnLikedCount={post.liked_user_ids.split(',').length}
                    btnSavedActive={post.saved_user_ids.includes(userID)}
                    btnSavedCount={post.saved_user_ids.split(',').length}
                    mutate={mutate}
                  />
                </div>
              )
            })}
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            router.push('/forum')
          }}
        >
          查看更多
        </button>
      </div>
    </>
  )
}
