'use client'

import Link from 'next/link'

export default function MemberNav({ OpenMenu = false }) {
  let open = ''
  if (OpenMenu) {
    open = 'open'
  } else {
    open = ''
  }
  return (
    <>
      <div className={'user-nav' + ' ' + open}>
        <ul>
          <li className="title">個人</li>
          <Link href="/member/profile">
            <li>基本資料</li>
          </Link>
          <Link href="/member/password">
            <li>密碼變更</li>
          </Link>
        </ul>
      </div>
    </>
  )
}
