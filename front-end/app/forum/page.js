'use client'

import ComponentsSearchBar from './_components/search-bar'
import ComponentsSearchButton from './_components/search-button'
import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ComponentsPostCard from './_components/post-card'
import Componentstab from '../_components/tab'
import { useAuth } from '../../hook/use-auth'
import { useFilter } from './_context/filterContext'
import PostLoader from './_components/loader-post'
import GetPosts from './_hooks/getPosts'

export default function ForumPage() {
  const router = useRouter()
  const { user } = useAuth()
  const userID = user.id
  const [tabParams, setTabParams] = useState(new URLSearchParams())
  const [asideParams, setAsideParams] = useState(new URLSearchParams())
  const { productCateItems, postCateItems } = useFilter()

  const handleTabChange = (tabNumber) => {
    const params = new URLSearchParams()
    params.append('tab', tabNumber)
    setTabParams(params)
    const mergedParams = new URLSearchParams([
      ...asideParams.entries(),
      ...params.entries(),
    ])
    router.push(`http://localhost:3000/forum?${mergedParams.toString()}`)
  }

  const handleAsideSearchChange = (keyword, productCate, postCate) => {
    // NOTE 本來拆開在button事件中，使用button點擊事件作為跳轉判端依據，需要寫重複兩次程式，每次也會是新params因此product和post無法相互繼承
    const params = new URLSearchParams()
    if (keyword.length) {
      params.append('keyword', keyword)
    }
    if (productCate.length) {
      params.append('productCate', productCate.join(','))
    }
    if (postCate.length) {
      params.append('postCate', postCate.join(','))
    }
    setAsideParams(params)
    const mergedParams = new URLSearchParams([
      ...tabParams.entries(),
      ...params.entries(),
    ])
    mutate()
    router.push(`http://localhost:3000/forum?${mergedParams.toString()}`)
  }

  const params = useSearchParams()
  const { posts, isResultExist, showLoading, error, mutate } = GetPosts(params)

  // 無限滾動
  const [page, setPage] = useState(1)
  const [allPosts, setAllPosts] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const observerRef = useRef(null)
  const limit = 6

  // // 合併新資料
  // useEffect(() => {
  //   if (posts && posts.length > 0) {
  //     setAllPosts((prev) => {
  //       // 避免重複
  //       const ids = new Set(prev.map((p) => p.id))
  //       return [...prev, ...posts.filter((p) => !ids.has(p.id))]
  //     })
  //     if (posts.length < limit) setHasMore(false)
  //   } else if (page === 1) {
  //     setAllPosts([])
  //     setHasMore(false)
  //   }
  // }, [posts])

  // // Intersection Observer 無限滾動
  // useEffect(() => {
  //   if (!hasMore) return
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0].isIntersecting) {
  //         setPage((prev) => prev + 1)
  //       }
  //     },
  //     { threshold: 1 }
  //   )
  //   if (observerRef.current) observer.observe(observerRef.current)
  //   return () => {
  //     if (observerRef.current) observer.unobserve(observerRef.current)
  //   }
  // }, [hasMore])

  // // 當 params 變動時重置
  // useEffect(() => {
  //   setPage(1)
  //   setAllPosts([])
  //   setHasMore(true)
  // }, [params.toString()])

  return (
    <>
      <main className="main col col-10 col-xl-8 d-flex flex-column align-items-center mx-0 px-0 position-relative overflow-hidden h-100">
        <div className="tabs d-flex position-absolute w-100 top-0 px-3">
          <Componentstab
            cates={['熱門', '最新']}
            height={'40'}
            // setTab={setTab}
            handleTabChange={handleTabChange}
          />
          <ComponentsSearchButton
            postCateItems={postCateItems}
            productCateItems={productCateItems}
            handleAsideSearchChange={handleAsideSearchChange}
          />
        </div>
        <div className="posts maxWidth800 d-flex flex-column gap-3 pt-5 pb-5 px-3 mt-1 w-100 overflow-auto scroll-bar-settings">
          {/* <PostLoader /> */}
          {error ? (
            '連線錯誤'
          ) : showLoading ? (
            Array(5)
              .fill(1)
              .map((v, i) => <PostLoader key={i} />)
          ) : !isResultExist ? (
            <div className="d-flex flex-column gap-3">
              <div className="py-3 text-center sub-text-color fs20 fst-italic fw-normal">
                ——查無文章——
              </div>
              <div className="text-center main-color fw-medium">
                觀看更多美妝心得👇
              </div>
              {posts?.map((post, idx) => {
                if (idx === posts.length - 1) {
                  return (
                    <div key={idx} ref={observerRef}>
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
                    </div>
                  )
                }
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
                )
              })}
            </div>
          ) : (
            posts?.map((post, idx) => {
              if (idx === posts.length - 1) {
                return (
                  <div key={idx} ref={observerRef}>
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
                  </div>
                )
              }
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
              )
            })
          )}
        </div>
      </main>
      <div className="col col-2 d-none d-xl-block px-0 ps-xl-2 ps-xxl-0 position-relative">
        <ComponentsSearchBar
          // setKeyword={setKeyword}
          // setTab={setTab}
          // setProductCate={setProductCate}
          // setPostCate={setPostCate}
          postCateItems={postCateItems}
          productCateItems={productCateItems}
          handleAsideSearchChange={handleAsideSearchChange}
        />
      </div>
    </>
  )
}
