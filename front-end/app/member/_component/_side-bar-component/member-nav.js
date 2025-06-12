'use client'

import Link from 'next/link'

export default function MemberNav({
  OpenMenu = false,
  setOpenMenu = () => {},
}) {
  let open = ''
  if (OpenMenu) {
    open = 'open'
  } else {
    open = ''
  }
  return (
    <>
      <button
        className={'user-nav' + ' ' + open}
        onClick={(e) => {
          e.preventDefault()
          if (e.target.matches('li')) {
            setOpenMenu(false)
          }
        }}
      >
        <ul>
          <li className="title">個人</li>
          <Link href="/member/profile">
            <li>基本資料</li>
          </Link>
          <Link href="/member/password">
            <li>密碼變更</li>
          </Link>
        </ul>
        <ul>
          <li className="title">購物</li>
          <Link href="/member/like-list">
            <li>願望清單</li>
          </Link>
          <Link href="/member/coupon">
            <li>我的優惠券</li>
          </Link>
          <Link href="/member/order">
            <li>訂單紀錄</li>
          </Link>
        </ul>
        <ul>
          <li className="title">課程</li>
          <Link href="/member/course">
            <li>我的課程</li>
          </Link>
          {/* <Link href="/member/teacher">
            <li>教師管理</li>
          </Link> */}
        </ul>
        <ul>
          <li className="title">文章</li>
          <Link href="/member/my-forum/my-following">
            <li>我的追蹤</li>
          </Link>
          <Link href="/member/my-forum/my-post">
            <li>我的文章</li>
          </Link>
          <Link href="/member/my-forum/saved-post">
            <li>收藏文章</li>
          </Link>
        </ul>
      </button>
    </>
  )
}
