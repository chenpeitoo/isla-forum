'use client'

import './post.css'
import { useParams, useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import EditPostModal from '../_components/edit-post-modal'
import useSWR from 'swr'
import ComponentsBtnLikedSaved from '../_components/btn-liked-saved'
import ComponentsMorePost from './_components/morePost'
import ComponentsAuthorInfo from '../_components/author-info'
import { useAuth } from '../../../hook/use-auth'
import ConfirmModal from '../_components/confirmModal'
import CommentSection from './comment-section'
import CommentInput from './comment-input'
import Link from 'next/link'
import PostDetailLoader from '../_components/loader-detail'
import { UseDirectToLogin } from '../_hooks/useDirectToLogin'
import { toast } from 'react-toastify'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function PostIDPage(props) {
  const router = useRouter()
  const { user, isAuth } = useAuth() //NOTE
  const userID = user.id
  const userNick = user.nickname
  const postID = useParams().postID
  const [commentMutate, setCommentMutate] = useState()
  const [lastCommentRef, setLastCommentRef] = useState()
  // if (commentMutate) console.log(commentMutate)

  const postAPI = `http://localhost:3005/api/forum/posts/post-detail?postID=${postID}`
  const { data, isLoading, error, mutate } = useSWR(postAPI, fetcher)
  let posts = data?.data?.posts
  let post = {}
  let morePosts = data?.data?.morePosts

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
    post = posts[0]
  }
  if (Array.isArray(morePosts)) {
    morePosts = morePosts.map((morePost) => {
      return {
        ...morePost,
        // liked_user_ids: ''?.split(',').map(Number) ?? [], NOTE 這個會回覆[0]而非空陣列
        liked_user_ids: morePost.liked_user_ids?.split(',').map(Number) ?? [],
        saved_user_ids: morePost.saved_user_ids?.split(',').map(Number) ?? [],
      }
    })
  }

  // 日期格式
  const date = new Date(post?.updated_at)
  const time = date.getTime()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const oneDay = 24 * 60 * 60 * 1000
  const todayNow = new Date()
  const todayMidTime = new Date(
    todayNow.getFullYear(),
    todayNow.getMonth(),
    todayNow.getDate()
  ).getTime()

  let dateFormat
  if (Date.now() - time <= 120000) {
    dateFormat = '剛剛'
  } else if (time >= todayMidTime) {
    dateFormat = date.toLocaleTimeString('zh-TW', {
      hour: 'numeric',
      minute: 'numeric',
    })
  } else if (time >= todayMidTime - oneDay) {
    const time = date.toLocaleTimeString('zh-TW', {
      hour: 'numeric',
      minute: 'numeric',
    })
    dateFormat = `昨日 ${time}`
  } else {
    dateFormat = `${month}月${day}日`
  }

  const handleDeletePost = async () => {
    const res = await fetch(
      `http://localhost:3005/api/forum/posts/soft-delete/${post.id}`,
      { method: 'PUT' }
    )
    if (!res.ok) throw new Error('未成功連線')
    // 已刪除提示 FIXME
    router.push('/forum')
    toast.info('已成功刪除貼文')
  }

  // const handleDirectLogin = UseDirectToLogin(isAuth)
  // console.log(post)
  return (
    <>
      {/* <PostDetailLoader /> */}
      <main className="main col col-10 col-xl-8 d-flex flex-column align-items-center px-0 h-100">
        {error ? (
          <div className="fs24 d-flex flex-column align-items-center mx-auto mt-3 gap-2">
            <div>連線錯誤，試試重新整理</div>
            <Link
              href={'/forum'}
              className="main-color fs24 text-decoration-underline"
            >
              回到論壇首頁
            </Link>
          </div>
        ) : showLoading ? (
          <div className="posts d-flex flex-column gap16 pb-0 w-100 h-100 px-3 maxWidth800">
            <div className="post d-flex flex-column gap-2 rounded-top-4 shadow-forum bg-pure-white pt-4 px-4 card-border position-relative min-vh-100">
              <PostDetailLoader />
            </div>
          </div>
        ) : !posts || posts.length === 0 ? (
          <div className="fs24 d-flex flex-column align-items-center mx-auto mt-3 gap-2">
            <div>查無此文章</div>
            <Link
              href={'/forum'}
              className="main-color fs20 text-decoration-underline"
            >
              回到論壇首頁
            </Link>
          </div>
        ) : (
          <div className="posts d-flex flex-column gap16 pb-0 w-100 h-100 px-3 maxWidth800">
            <div className="post d-flex flex-column gap-2 rounded-top-4 shadow-forum bg-pure-white pt-4 card-border position-relative">
              <div className="post-header d-flex  align-items-start mx-4">
                <div className="post-title flex-grow-1 me-3 fs24 fw-medium">
                  <span className="post-tag d-inline align-middle px-2 py-1 me-2 my-auto rounded-pill fs12 text-nowrap bg-light-hover main-color">
                    {post.cate_name}
                  </span>
                  {post.title}
                </div>
                <div className="btn-group">
                  <button
                    className={`post-update button-clear main-text-color ${post.user_id === userID ? 'd-block' : 'd-none'}`}
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-pencil fs24" />
                  </button>
                  <div
                    className="dropdown-menu dropdown-menu-end dropdown-menu-small"
                    style={{ width: '100px' }}
                  >
                    <div className="dropdown-forum d-flex flex-column border-0 main-text-color">
                      <button
                        className="dropdown-item-forum px-0 py-2 button-clear"
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#updatedPostModal"
                      >
                        編輯文章
                      </button>
                      <button
                        className="dropdown-item-forum px-0 py-2 button-clear color-accent"
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#confirmModal"
                      >
                        刪除文章
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="author-info d-inline-flex align-items-center gap-2 mb-2 mx-4">
                  <ComponentsAuthorInfo
                    authorID={post.user_id}
                    width="24"
                    src={post.user_img}
                    alt={post.user_nick}
                    fontSize={14}
                    color={'var(--main-text-color)'}
                    authorName={post.user_nick}
                  />
                  <button
                    className="button-clear fs12 main-color"
                    onClick={() => {}}
                  >
                    追蹤中
                  </button>
                  <div className="updated-at sub-text-color fs12 fw-light">
                    {dateFormat}
                  </div>
                </div>
              </div>
              <div
                className="post-content d-flex flex-column gap-3 mx-4 pb-4 mb-2 bottom-stroke"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              <div className="evaluates d-flex mb-5 mx-4">
                <ComponentsBtnLikedSaved
                  type="liked"
                  active={post.liked_user_ids.includes(userID)}
                  count={post.liked_user_ids.length}
                  postID={postID}
                  userID={userID}
                  mutate={mutate}
                  color={''}
                />
                <button
                  className="evaluate px-2 py-1 border-0 rounded-3 d-flex align-items-center"
                  // onClick={() => {
                  //   router.push('#scrollToBottom')
                  // }}
                >
                  <i className="bi bi-chat me-1 fs16" />
                  {post.comment_count}
                </button>
                <ComponentsBtnLikedSaved
                  type="saved"
                  active={post.saved_user_ids.includes(userID)}
                  count={post.saved_user_ids.length}
                  postID={postID}
                  userID={userID}
                  mutate={mutate}
                />
              </div>
              <div className="more-section mx-4">
                <div className="more-header py-2 bottom-stroke sub-text-color">
                  更多文章
                </div>
                <div className="more-cards d-flex flex-wrap py-2">
                  {Array.isArray(morePosts) &&
                    morePosts.map((morePost) => {
                      return (
                        <div key={morePost.id} className="w-50 p-1">
                          <ComponentsMorePost
                            postTitle={morePost.title}
                            likedUserIDs={morePost.liked_user_ids}
                            savedUserIDs={morePost.saved_user_ids}
                            commentCount={morePost.comment_count}
                            postID={morePost.id}
                            userID={userID} //登入使用者
                            authorID={morePost.user_id}
                            authorNick={morePost.user_nick}
                            authorUrl={morePost.user_img}
                            mutate={mutate}
                          />
                        </div>
                      )
                    })}
                </div>
              </div>
              <CommentSection
                setCommentMutate={setCommentMutate}
                setLastCommentRef={setLastCommentRef}
              />

              <CommentInput
                mutate={commentMutate}
                lastCommentRef={lastCommentRef}
              />
            </div>
          </div>
        )}
      </main>
      <div className="col col-2 d-none d-xl-block px-0 ps-xl-2 ps-xxl-0 position-relative"></div>
      {post && (
        <>
          <EditPostModal
            postID={post.id}
            productCate={post.product_cate_id}
            postCate={post.cate_id}
            postTitle={post.title}
            postContent={post.content}
            isUpdated={true}
            mutateDetail={mutate}
          />
          <EditPostModal
            postID=""
            productCate=""
            postCate=""
            postTitle=""
            postContent=""
            isUpdated={false}
            // mutate={mutate}
          />
          <ConfirmModal
            title="確定刪除嗎？"
            content="刪除後，文章將無法復原"
            confirm="刪除"
            cancel="取消"
            handleModalAction={handleDeletePost}
          />
        </>
      )}
    </>
  )
}
