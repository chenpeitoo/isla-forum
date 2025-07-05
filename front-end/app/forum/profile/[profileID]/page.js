'use client'

import ComponentsAvatar from '../../_components/avatar'
import useSWR from 'swr'
import { useEffect, useState, useRef } from 'react'
import EditPostModal from '../../_components/edit-post-modal'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ComponentsPostCard from '../../_components/post-card'
import { useAuth } from '../../../../hook/use-auth'
import ComponentsButtonFollowing from '../../_components/btn-follow'
import ComponentsButtonChat from '../../_components/btn-chat'
import PostLoader from '../../_components/loader-post'
import ConfirmModal from '../../_components/confirmModal'
import UseFollow from '../../_hooks/useFollow'

const fetcher = (url) => fetch(url).then((res) => res.json())

export default function ForumPage(props) {
  // 導向
  const router = useRouter()

  const authorID = useParams().profileID
  const { user } = useAuth()
  const userID = parseInt(user.id, 10)
  const followID = parseInt(useParams().profileID, 10)
  const isOwnProfile = userID === followID

  // fetch每篇文章的資料
  const postsAPI = `http://localhost:3005/api/forum/posts/profile?authorID=${authorID}&userID=${userID}`
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

  if (error) {
    console.log(error)
    return (
      <main className="main col col-10 d-flex flex-column align-items-center">
        連線錯誤
      </main>
    )
  }
  // console.log(data)
  const posts = data?.status === 'success' ? data?.data : []

  const { handleFollow, isFollow, followCount } = UseFollow(userID, followID)
  const method = isFollow ? 'DELETE' : 'POST'
  console.log(isFollow, method, userID)

  return (
    <>
      <main className="main col col-10 col-xl-8 d-flex flex-column align-items-center h-100">
        {/* author-card-sm */}
        {!showLoading && posts.length !== 0 && (
          <div className="author-card d-block d-xl-none position-relative px-0 mb-3 w-100">
            <aside className="aside d-flex flex-column flex-md-row gap-3 position-sticky">
              <div className="d-flex flex-row flex-wrap justify-content-center align-items-center gap-3 px-2 me-md-auto">
                <div className="author-info d-flex align-items-center gap-2 me-sm-auto">
                  <ComponentsAvatar
                    src={posts[0].user_img}
                    alt={posts[0].user_nick}
                    classWidth="64"
                  />
                  <span className="fs24 fw-medium">{posts[0].user_nick}</span>
                </div>
                <div className="d-flex justify-content-end gap-3 text-nowrap">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fs24 main-color">{followCount}</span>
                    <span className="fs14 main-text-color">粉絲</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="fs24 main-color">{posts.length}</span>
                    <span className="fs14 main-text-color">文章</span>
                  </div>
                </div>
              </div>
              {!isOwnProfile ? (
                <div className="following-button d-flex gap-2 my-auto flex-grow-0 fs14">
                  <ComponentsButtonFollowing
                    isFollow={isFollow}
                    handleFollow={handleFollow}
                  />
                  <ComponentsButtonChat />
                </div>
              ) : (
                <button
                  className={`button-triggerable default-sub px-3 py-1 my-auto  color-isla-white rounded-3 text-nowrap fw-medium fs14`}
                  onClick={() => {
                    router.push('/member/profile')
                  }}
                >
                  編輯個人資料
                  <i className="bi bi-arrow-up-right ms-2"></i>
                </button>
              )}
            </aside>
          </div>
        )}
        <div className="posts d-flex flex-column gap-3 w-100">
          {showLoading ? (
            <PostLoader />
          ) : posts.length === 0 ? (
            <div className="fs24 d-flex flex-column align-items-center mx-auto mt-3 gap-2">
              <div>此使用者尚未建立個人檔案</div>
              <Link
                href={'/forum'}
                className="main-color fs24 text-decoration-underline"
              >
                回到論壇首頁
              </Link>
            </div>
          ) : (
            posts !== 0 &&
            posts?.map((post) => {
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
                  userID={userID}
                  mutate={mutate}
                />
              )
            })
          )}
        </div>
      </main>
      {/* author-card-xl */}
      {/* {!showLoading && posts.length !== 0 && ( */}
      <div className="author-card author-card-xl col col-2 d-none d-xl-block position-relative px-0 mb-3">
        {!showLoading && posts.length !== 0 && (
          <aside className="aside d-flex flex-column p-4 gap-3 position-sticky bg-pure-white card-border shadow-forum rounded-3 top-0 h-100">
            <div className="d-flex flex-column justify-content-center align-items-center gap-3">
              <div className="d-flex flex-column align-items-center gap-1 w-100">
                <ComponentsAvatar
                  src={posts[0].user_img}
                  alt={posts[0].user_nick}
                  classWidth="64"
                />
                <span className="fs24 fw-medium">{posts[0].user_nick}</span>
              </div>
              <div className="d-flex w-100 text-nowrap">
                <div className="d-flex flex-column align-items-center justify-content-center w-50">
                  <span className="fs24 main-color">{followCount}</span>
                  <span className="fs14 main-text-color">粉絲</span>
                </div>
                <div className="d-flex flex-column align-items-center justify-content-center w-50">
                  <span className="fs24 main-color">{posts.length}</span>
                  <span className="fs14 main-text-color">文章</span>
                </div>
              </div>
            </div>
            {!isOwnProfile ? (
              <div className="following-button d-flex gap-2 w-100 fs14">
                <ComponentsButtonFollowing
                  isFollow={isFollow}
                  handleFollow={handleFollow}
                />
                <ComponentsButtonChat />
              </div>
            ) : (
              <button
                className={`button-triggerable default-sub px-3 py-1 my-auto  color-isla-white rounded-3 text-nowrap fw-medium fs14`}
                onClick={() => {
                  router.push('/member/profile')
                }}
              >
                編輯個人資料
                <i className="bi bi-arrow-up-right ms-2"></i>
              </button>
            )}
          </aside>
        )}
      </div>
      <ConfirmModal
        title="確認取消追蹤？"
        content="您可隨時重新追蹤對方"
        confirm="取消追蹤"
        cancel="繼續追蹤"
        handleModalAction={handleFollow}
        param={method}
      />
    </>
  )
}
