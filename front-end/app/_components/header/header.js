'use client'
import Link from 'next/link'
import Image from 'next/image'
//style
import { useAuth } from '@/hook/use-auth'
// import { useCartContext } from '../../cart/context/cart-context'
// component
import HamMenu from './_component/ham-menu'
import HamMeunNav from './_component/ham-meun-nav'
import HeaderNav from './_component/header-nav'
// import CartDropdown from '../../cart/_component/cart-dropdown/cart-dropdown'
import SearchBlockLg from './_component/search-block/search-block-lg'
import './header.css'
// hook
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
// route
import { USER_AVA_URL } from '@/_route/img-url'
import { toast } from 'react-toastify'

export default function Header() {
  // const { totalCount, cartItems } = useCartContext()
  const pathname = usePathname()
  const router = useRouter()
  const [hamMenuOpen, setHamMenuOpen] = useState(false) // 開啟手機、平板的nav
  const [searchOpen, setSearchOpen] = useState(false) // 開啟搜尋功能
  // console.log('searchOpen', searchOpen)
  const { user, isAuth } = useAuth()
  // console.log('header: user: ', user)
  // ==== 購物車按鈕路徑定義 ====
  const handleCartClick = () => {
    const token = localStorage.getItem('jwtToken')
    if (!token) {
      router.push('/member/login')
    } else {
      router.push('/cart')
    }
  }
  // ==== END 購物車按鈕路徑定義 ====
  // ==== 使用者按鈕路徑、圖像定義 ====
  let loginUrl = isAuth ? 'profile' : 'login'
  let loginAva = isAuth ? (
    <div
      className="
    overflow-hidden rounded-pill shadow header-avartar"
    >
      <Image
        src={
          user.ava_url
            ? USER_AVA_URL + user.ava_url
            : `${process.env.NEXT_PUBLIC_PUBLIC_URL}/images/member/default-user.jpg`
        }
        alt={USER_AVA_URL + user.ava_url}
        width={40}
        height={40}
      />
    </div>
  ) : (
    <i className="bi bi-person-circle" />
  )
  // console.log('🛒 Header totalCount:', totalCount)

  // ==== END 使用者按鈕路徑、圖像定義 ====
  if (
    pathname.includes('login') ||
    pathname.includes('register') ||
    pathname.includes('forget-password') ||
    pathname.includes('dashboard')
  ) {
    return <></>
  }
  // console.log('main-page isAuth:', isAuth)
  // console.log('main-page user:', user)
  const handleOnClick = (e) => {
    e.preventDefault()
    toast.info('功能已關閉')
  }
  return (
    <>
      <header>
        <div className="d-none d-lg-block header-lg-search-bar-container">
          <SearchBlockLg open={searchOpen} />
        </div>
        <div className="position-relative header-body">
          {/* (START) for burger menu*/}
          <HamMeunNav
            hamMenuOpen={hamMenuOpen}
            setHamMenuOpen={setHamMenuOpen}
          />
          <HamMenu hamMenuOpen={hamMenuOpen} setHamMenuOpen={setHamMenuOpen} />
          {/* (END) for burger menu */}
          <div>
            <div className="order-lg-1 order-2 title">ISLA</div>
          </div>
          {/*  nav-bar */}
          <HeaderNav />
          <div className="order-3 icons">
            <button
              className="d-lg-block d-none"
              onClick={handleOnClick}
              // onClick={() => {
              //   setSearchOpen(!searchOpen)
              // }}
              // onMouseEnter={() => {
              //   setSearchOpen(true)
              // }}
              // onMouseLeave={() => {
              //   setSearchOpen(false)
              // }}
            >
              <i className="bi bi-search header-search-icon" />
            </button>

            {/* <button
              className="cart-icon"
              type="button"
              onClick={handleCartClick}
            >
              <Image
                src="/header/Elements/Navigation/outline/shoppingbag.svg"
                alt="購物袋"
                width={34}
                height={34}
              />
              <div>{totalCount}</div>
            </button> */}
            {/* <CartDropdown
              totalCount={totalCount}
              cartItems={cartItems}
              onCartClick={handleCartClick}
            /> */}

            <Link
              href={'/member/my-forum/my-following'}
              className="d-lg-block d-none"
            >
              <button>{loginAva}</button>
            </Link>
          </div>
        </div>
      </header>
    </>
  )
}
