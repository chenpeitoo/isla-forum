'use client'

import './_style/basic-profile.css'
import Link from 'next/link'

export default function BasicProfile({ user }) {
  // console.log('birthday: ', user.birthday.split(' ')[0])
  return (
    <>
      <div className="d-flex justify-content-lg-start justify-content-center w-100">
        <div className="d-flex flex-column gap-3">
          <div className="basic-profile-row">
            <div>帳號</div>
            <div>{user.email}</div>
          </div>
          <div className="basic-profile-row">
            <div>出生日期</div>
            <div>
              {user.birthday ? (
                user.birthday.split(' ')[0]
              ) : (
                <Link href="/member/register">完成註冊</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
