'use client'

import ComponentsSearchBar from './_components/search-bar'
import ComponentsSearchButton from './_components/search-button'
import { useRouter, useSearchParams } from 'next/navigation'
import ComponentsPostCard from './_components/post-card'
import Componentstab from '../_components/tab'
import { useAuth } from '../../hook/use-auth'
import PostLoader from './_components/loader-post'
// import GetPosts from './_hooks/getPosts'
import usePostsInfinite from './_hooks/usePostsInfinite'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useFilter } from './_context/filterContext'
import { useRef, useState } from 'react'

export default function ForumPage() {
  const postsRef = useRef()
  const userID = useAuth().user.id
  const queryObj = useSearchParams() // 抓取當前網址查詢參數，用於請求資料

  // 類型：ReadonlyURLSearchParams {size: 1}
  const {
    posts = [],
    size,
    setSize,
    showLoading,
    error,
    mutate,
    hasMore,
  } = usePostsInfinite(queryObj)

  // const [params, setParams] = useState(new URLSearchParams())
  //
  const { setTab } = useFilter()

  const fetchMore = () => {
    // 為了顯示無限滾動+loading設計
    setTimeout(() => {
      setSize(size + 1)
    }, 1000)
  }

  const handleTabChange = (tabNumber) => {
    // 跳轉等工作都交還給filter context 處理
    setTab(tabNumber)
    postsRef?.current.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
    mutate()
  }

  return (
    <>
      <main className="main col col-10 col-xl-8 d-flex flex-column align-items-center mx-0 px-0 position-relative overflow-hidden h-100">
        <div className="tabs d-flex position-absolute w-100 top-0 px-3">
          <Componentstab
            cates={['熱門', '最新']}
            height={'40'}
            handleTabChange={handleTabChange}
          />
          <ComponentsSearchButton />
        </div>
        <div
          id="scrollableDiv"
          ref={postsRef}
          className="posts maxWidth800 d-flex flex-column gap-3 pt-5 pb-5 mt-1 w-100 overflow-auto scroll-bar-settings"
        >
          {error ? (
            '連線錯誤'
          ) : showLoading ? (
            Array(5)
              .fill(1)
              .map((v, i) => <PostLoader key={i} />)
          ) : posts?.length === 0 ? (
            <div className="d-flex flex-column gap-3">
              <div className="py-3 text-center sub-text-color fs20 fst-italic fw-normal">
                ——查無文章——
              </div>
            </div>
          ) : (
            <InfiniteScroll
              className="overflow-hidden"
              dataLength={posts.length}
              next={fetchMore}
              hasMore={hasMore}
              loader={<PostLoader />}
              endMessage={<div className="text-center">沒有更多貼文</div>}
              scrollableTarget="scrollableDiv"
            >
              {posts?.map((post, i) => (
                <ComponentsPostCard
                  key={i}
                  postID={post.id}
                  postTitle={post.title}
                  postCateName={post.cate_name}
                  productCateName={post.prodcut_cate_name}
                  postContent={post.content}
                  authorID={post.user_id}
                  width="21"
                  src={post.user_img}
                  alt={post.user_name}
                  fontSize="14"
                  color="var(--sub-text)"
                  updatedAt={post.updated_at.toString()}
                  authorName={post.user_nick}
                  btnLikedActive={post.liked_user_ids.includes(userID)}
                  btnSavedActive={post.saved_user_ids.includes(userID)}
                  btnLikedCount={post.liked_user_ids.length}
                  btnSavedCount={post.saved_user_ids.length}
                  commentCount={post.comment_count}
                  userID={userID}
                  mutate={mutate}
                />
              ))}
            </InfiniteScroll>
          )}
        </div>
      </main>
      <div className="col col-2 d-none d-xl-block px-0 ps-xl-2 ps-xxl-0 position-relative">
        <ComponentsSearchBar />
      </div>
    </>
  )
}
