'use client'

import { useAuth } from '@/hook/use-auth'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import MemberNav from './_side-bar-component/member-nav'
import OpneNav from './_side-bar-component/open-nav'
import UploadAva from './_side-bar-component/upload-ava'
import LoadingLottie from '@/app/_components/loading/lottie-loading'
import { toast } from 'react-toastify'
import './_style.css/side-bar.css'
import { USER_AVA_URL } from '@/_route/img-url.js'

export default function SideBar() {
  const pathname = usePathname()
  const router = useRouter()
  const [OpenMenu, setOpenMenu] = useState(false) // open nav bar in RWD
  const [openAvatar, setOpenAvatar] = useState(false)
  const { user, logout, initAuth } = useAuth()

  // ==== 確認是否登入 ====
  useEffect(() => {
    const isLogin = async () => {
      await initAuth()
      const isAuthLocal = localStorage.getItem('jwtToken') || false
      // console.log(`isAuth`, isAuth)
      if (!isAuthLocal) {
        toast.error('請先登入', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
        })
        router.push('/member/login')
        return
      }
    }
    // 不包含以下網址才執行
    if (
      !(
        pathname.includes('login') ||
        pathname.includes('register') ||
        pathname.includes('forget-password')
      )
    ) {
      isLogin()
    }
  }, [])
  // return <></> in login, register, ......
  if (
    pathname.includes('login') ||
    pathname.includes('register') ||
    pathname.includes('forget-password')
  ) {
    return <></>
  }
  // Loading 畫面
  if (!user?.email) {
    return <></>
  }
  return (
    <>
      {/* aside-bar */}
      <aside className="col-lg-3 col-12 flex-lg-column">
        <div className="d-flex flex-column align-items-center gap-2 w-100 position-relative user-head">
          {/* avatar, nickname, .... (member info) */}
          <button
            className="avatar-button"
            onClick={() => {
              setOpenAvatar(!openAvatar)
            }}
          >
            <div className="avartar overflow-hidden">
              <Image
                src={
                  user.ava_url
                    ? USER_AVA_URL + user.ava_url
                    : 'http://localhost:3000/images/member/default-user.jpg'
                }
                alt={USER_AVA_URL + user.ava_url}
                width={90}
                height={90}
              />
            </div>
          </button>
          <UploadAva
            openAvatar={openAvatar}
            setOpenAvatar={setOpenAvatar}
            initAuth={initAuth}
          />
          <h4 className="user-title">{user?.nickname || '訪客'}</h4>
          <p>{user?.email || 'no account'}</p>
          <Link
            onClick={() => {
              logout()
            }}
            href="/member/login"
          >
            登出
          </Link>
        </div>
        {/* ==== user-nav-bar ==== */}
        <OpneNav OpenMenu={OpenMenu} setOpenMenu={setOpenMenu} />
        <MemberNav OpenMenu={OpenMenu} setOpenMenu={setOpenMenu} />
      </aside>
    </>
  )
}
