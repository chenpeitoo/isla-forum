'use client'

import Link from 'next/link'
import { toast } from 'react-toastify'

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

  const handleOnClick = (e) => {
    e.preventDefault()
    toast.info('功能已關閉')
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
        {/* <ul>
          <li className="title">個人</li>
          <Link href="/member/profile" onClick={handleOnClick}>
            <li>基本資料</li>
          </Link>
          <Link href="/member/password" onClick={handleOnClick}>
            <li>密碼變更</li>
          </Link>
        </ul> */}
        {/* <ul>
          <li className="title">購物</li>
          <Link href="/member/like-list" onClick={handleOnClick}>
            <li>願望清單</li>
          </Link>
          <Link href="/member/coupon" onClick={handleOnClick}>
            <li>我的優惠券</li>
          </Link>
          <Link href="/member/order" onClick={handleOnClick}>
            <li>訂單紀錄</li>
          </Link>
        </ul>
        <ul>
          <li className="title">課程</li>
          <Link href="/member/course" onClick={handleOnClick}>
            <li>我的課程</li>
          </Link>
        </ul> */}
      </button>
    </>
  )
}
