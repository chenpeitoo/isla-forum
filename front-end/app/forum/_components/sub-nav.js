'use client'

import './forum.css'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
// import EditPostModal from './edit-post-modal'
import ComponentsAuthorInfo from './author-info'
import EditPostModal from './edit-post-modal'
import Ripples from 'react-ripples'
import { UseDirectToLogin } from '../_hooks/useDirectToLogin'
import { useAuth } from '../../../hook/use-auth'
import useSWR from 'swr'

const fetcher = ([url, body]) =>
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then((res) => res.json())

export default function ComponentsSubNav() {
  const modalRef = useRef()
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js').then((bootstrap) => {
      document
        .querySelectorAll('[data-bs-toggle="tooltip"]')
        .forEach((el) => new bootstrap.Tooltip(el))

      const modalEl = modalRef.current
      if (modalEl) {
        new bootstrap.Modal(modalEl, {
          backdrop: true,
          keyboard: true,
        })
      }
    })
  }, [])

  const userID = useAuth().user.id
  const isAuth = userID !== 0
  const { data, isLoading, error, mutate } = useSWR(
    [
      `http://localhost:3005/api/forum/follow/get-follow-list`,
      { userID, pageName: 'subNav' },
    ],
    fetcher
  )
  const followings = data?.data
  // console.log(followings)

  const url = usePathname()
  const handleDirectToLogin = UseDirectToLogin({ isAuth })

  return (
    <>
      <div className="sub-nav-container col col-2 d-none d-lg-block px-0 position-relative">
        <aside className="sub-nav position-sticky d-flex flex-column gap-3 w-100">
          <div className="sub-nav-items">
            <Ripples className="rounded-3 d-block">
              <Link
                href="/"
                className={`sub-nav-item d-flex px-3 py-3 gap-2 rounded-3 text-decoration-none fw-medium main-color`}
                type="button"
                data-bs-toggle={isAuth && 'modal'}
                data-bs-target={isAuth && '#editPostModal'}
                onMouseUp={(e) => {
                  e.currentTarget.blur()
                }}
                onClick={(e) => {
                  !isAuth && e.preventDefault()
                  handleDirectToLogin('/forum')
                }}
              >
                <i className="bi bi-plus-lg" />
                <span className="">撰寫貼文</span>
              </Link>
            </Ripples>
            <Ripples className="rounded-3 d-block">
              <Link
                href="/forum"
                className={`sub-nav-item d-flex px-3 py-3 gap-2 rounded-3 text-decoration-none fw-medium main-text-color`}
                onMouseUp={(e) => {
                  e.currentTarget.blur()
                }}
              >
                <i
                  className={`bi ${url === '/forum' ? 'bi-house-door-fill' : 'bi-house-door'}`}
                />
                <span className="">論壇首頁</span>
              </Link>
            </Ripples>
            <Ripples className="rounded-3 d-block">
              <Link
                href="/forum/chat"
                className={`sub-nav-item d-flex px-3 py-3 gap-2 rounded-3 text-decoration-none fw-medium main-text-color`}
                onMouseUp={(e) => {
                  e.currentTarget.blur()
                }}
                onClick={(e) => {
                  !isAuth && e.preventDefault()
                  handleDirectToLogin('')
                }}
              >
                <i
                  className={`bi ${url === '/forum/chat' ? 'bi-chat-dots-fill' : 'bi-chat-dots'}`}
                />
                <span className="">我的訊息</span>
              </Link>
            </Ripples>
            {/* FIXME 改成modal提示後，確認ripple是否還慢半拍 */}
            <Ripples className="rounded-3 d-block">
              <button
                className={`sub-nav-item button-clear d-flex px-3 py-3 gap-2 w-100 rounded-3 text-decoration-none fw-medium main-text-color fs16`}
                data-bs-toggle={isAuth ? 'collapse' : ''}
                data-bs-target="#panelsStayOpen-collapseOne"
                aria-expanded="true"
                aria-controls="panelsStayOpen-collapseOne"
                onMouseUp={(e) => {
                  e.currentTarget.blur()
                }}
                onClick={(e) => {
                  !isAuth && e.preventDefault()
                  handleDirectToLogin('/forum')
                }}
              >
                <i className="bi bi-people" />
                <span className="">追蹤對象</span>
              </button>
            </Ripples>
            <div
              id="panelsStayOpen-collapseOne"
              data-bs-parent="#accordionExample"
              className={`accordion-collapse collapse`}
            >
              <div className="followings fs14 d-flex flex-column px-4 py-1 gap-2">
                {isAuth &&
                  Array.isArray(followings) &&
                  followings.map((v, i) => {
                    return (
                      <Link
                        href={`/forum/profile/1`}
                        className="followings-link main-text-color py-1 text-truncate"
                        key={i}
                      >
                        <ComponentsAuthorInfo
                          authorID={v.follow_id}
                          width="20"
                          src={v.userImg}
                          alt={v.userNick}
                          fontSize="16"
                          color="var(--main-text)"
                          authorName={v.userNick}
                        />
                      </Link>
                    )
                  })}
              </div>
              <div className="d-flex text-center fs14 pt-2">
                <Link
                  href={'/member/my-forum/my-following'}
                  className="more-followings-link sub-text-color text-center rounded-pill px-0 py-1 mx-auto w-75"
                  onClick={(e) => {
                    if (!isAuth) e.preventDefault()
                    handleDirectToLogin('/member/my-forum/my-following')
                  }}
                >
                  查看全部 <i className="bi bi-arrow-up-right"></i>
                </Link>
              </div>
            </div>
            <Ripples className="rounded-3 d-block">
              <Link
                href="/member/my-forum/my-post"
                className={`sub-nav-item d-flex px-3 py-3 gap-2 rounded-3 text-decoration-none fw-medium main-text-color`}
                onMouseUp={(e) => {
                  e.currentTarget.blur()
                }}
                onClick={(e) => {
                  !isAuth && e.preventDefault()
                  handleDirectToLogin('/member/my-forum/my-post')
                }}
              >
                <i className="bi bi-file-earmark-text" />
                <span className="">我的文章</span>
                <i className="bi bi-arrow-up-right"></i>
              </Link>
            </Ripples>
            <Ripples className="rounded-3 d-block">
              <Link
                href="/member/my-forum/saved-post"
                className={`sub-nav-item d-flex px-3 py-3 gap-2 rounded-3 text-decoration-none fw-medium main-text-color`}
                onMouseUp={(e) => {
                  e.currentTarget.blur()
                }}
                onClick={(e) => {
                  !isAuth && e.preventDefault()
                  handleDirectToLogin('/member/my-forum/saved-post')
                }}
              >
                <i className="bi bi-bookmark" />
                <span className="">文章收藏</span>
                <i className="bi bi-arrow-up-right"></i>
              </Link>
            </Ripples>
          </div>
        </aside>
      </div>
      <div className="sub-nav-container-sm col col-2 d-block d-lg-none px-0 position-relative">
        <aside className="sub-nav position-sticky d-flex flex-column gap-3 w-100">
          <div className="sub-nav-items">
            <button
              className="button-clear w-100"
              data-bs-toggle={isAuth && 'modal'}
              data-bs-target={isAuth && '#editPostModal'}
              onMouseUp={(e) => {
                e.currentTarget.blur()
              }}
              onClick={(e) => {
                !isAuth && e.preventDefault()
                handleDirectToLogin('/forum')
              }}
            >
              <div
                className="sub-nav-item d-flex px-3 py-3 gap-2 rounded-3 text-decoration-none fw-medium main-color"
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title="撰寫貼文"
              >
                <i className="bi bi-plus-lg" />
              </div>
            </button>
            <Link
              href="/forum"
              className="sub-nav-item d-flex px-3 py-3 gap-2 rounded-3 text-decoration-none fw-medium main-text-color"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              title="論壇首頁"
              onMouseUp={(e) => {
                e.currentTarget.blur()
              }}
            >
              <i
                className={`bi ${url === '/forum' ? 'bi-house-door-fill' : 'bi-house-door'}`}
              />
            </Link>
            <Link
              href="/forum/chat"
              className="sub-nav-item d-flex px-3 py-3 gap-2 rounded-3 text-decoration-none fw-medium main-text-color"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              title="我的訊息"
              onMouseUp={(e) => {
                e.currentTarget.blur()
              }}
              onClick={(e) => {
                !isAuth && e.preventDefault()
                handleDirectToLogin('/forum/chat')
              }}
            >
              <i
                className={`bi ${url.includes('/forum/chat') ? 'bi-chat-dots-fill' : 'bi-chat-dots'}`}
              />
            </Link>
            <Link
              href="/member/my-forum/my-following"
              className="sub-nav-item d-flex px-3 py-3 gap-2 rounded-3 text-decoration-none fw-medium main-text-color"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              title="追蹤對象"
              onMouseUp={(e) => {
                e.currentTarget.blur()
              }}
              onClick={(e) => {
                !isAuth && e.preventDefault()
                handleDirectToLogin('/member/my-forum/my-following')
              }}
            >
              <i className="bi bi-people" />
            </Link>
            <Link
              href="/member/my-forum/my-post"
              className="sub-nav-item d-flex px-3 py-3 gap-2 rounded-3 text-decoration-none fw-medium main-text-color"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              title="我的文章"
              onMouseUp={(e) => {
                e.currentTarget.blur()
              }}
              onClick={(e) => {
                !isAuth && e.preventDefault()
                handleDirectToLogin('/member/my-forum/my-post')
              }}
            >
              <i className="bi bi-file-earmark-text" />
            </Link>
            <Link
              href="/member/my-forum/saved-post"
              className="sub-nav-item d-flex px-3 py-3 gap-2 rounded-3 text-decoration-none fw-medium main-text-color"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              title="文章收藏"
              onMouseUp={(e) => {
                e.currentTarget.blur()
              }}
              onClick={(e) => {
                !isAuth && e.preventDefault()
                handleDirectToLogin('/member/my-forum/saved-post')
              }}
            >
              <i className="bi bi-bookmark" />
            </Link>
          </div>
        </aside>
      </div>
      <div className="position-absolute">
        <EditPostModal
          postID=""
          productCate=""
          postCate=""
          postTitle=""
          postContent=""
          isUpdated={false}
          mutateDetail={() => {}}
        />
      </div>
    </>
  )
}
