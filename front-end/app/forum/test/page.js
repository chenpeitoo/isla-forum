'use client'

import React, { useState, useEffect } from 'react'
import GetPostsInfinite from '../_hooks/getPostsInfinite'
import InfiniteScroll from 'react-infinite-scroll-component'

export default function ForumTest(props) {
  const params = ''
  const {
    posts,
    otherPosts,
    size,
    setSize,
    showLoading,
    error,
    mutate,
    hasMore,
  } = GetPostsInfinite(params)

  const fetchMoreData = () => {
    console.log('fetch')
    setSize(size + 1)
  }

  return (
    <>
      <main className="main col col-10 col-xl-8 d-flex flex-column align-items-center mx-0 px-0 position-relative overflow-hidden h-100">
        <div className="posts maxWidth800 d-flex flex-column gap-3 pt-5 pb-5 px-3 mt-1 w-100 overflow-auto scroll-bar-settings">
          <hr />
          {posts && (
            <InfiniteScroll
              dataLength={posts.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={<h4>loading</h4>}
              endMessage={<h4>no more</h4>}
            >
              {posts.map((post, i) => (
                <div key={i}>{post.title}</div>
              ))}
            </InfiniteScroll>
          )}
          <hr />
        </div>
      </main>
    </>
  )
}
