'use client'
import Link from 'next/link'
import Image from 'next/image'
//styles
import { useAuth } from '@/hook/use-auth'
import { useCartContext } from '../../cart/context/cart-context'
//component
import HamMenu from './_component/ham-menu'
import HamMeunNav from './_component/ham-meun-nav'
import HeaderNav from './_component/header-nav'
import CartDropdown from '../../cart/_component/cart-dropdown/cart-dropdown'
import './header.css'
// hook
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
// route
import { USER_AVA_URL } from '@/_route/img-url'

export default function Header() {
  const { totalCount, cartItems } = useCartContext()
  const pathname = usePathname()
  const router = useRouter()
  const [hamMenuOpen, setHamMenuOpen] = useState(false)
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
    overflow-hidden rounded-pill shadow"
    >
      <Image
        src={
          user.ava_url
            ? USER_AVA_URL + user.ava_url
            : 'http://localhost:3000/images/member/default-user.jpg'
        }
        alt={USER_AVA_URL + user.ava_url}
        width={40}
        height={40}
      />
    </div>
  ) : (
    <i className="bi bi-person-circle" />
  )
  console.log('🛒 Header totalCount:', totalCount)

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
  return (
    <>
      <header>
        <div className="position-relative header-body">
          {/* (START) for burger menu*/}
          <HamMeunNav
            hamMenuOpen={hamMenuOpen}
            setHamMenuOpen={setHamMenuOpen}
          />
          <HamMenu hamMenuOpen={hamMenuOpen} setHamMenuOpen={setHamMenuOpen} />
          {/* (END) for burger menu */}
          <Link href="/">
            <div className="order-lg-1 order-2 title">ISLA</div>
          </Link>
          {/*  nav-bar */}
          <HeaderNav />
          <div className="order-3 icons">
            <button className="d-lg-block d-none">
              <i className="bi bi-search" />
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
            <CartDropdown cartItems={cartItems} onCartClick={handleCartClick} />

            <Link href={'/member/' + loginUrl} className="d-lg-block d-none">
              <button>{loginAva}</button>
            </Link>
          </div>
        </div>
      </header>
    </>
  )
}
