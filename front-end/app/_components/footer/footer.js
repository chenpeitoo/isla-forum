'use client'

import Link from 'next/link'
// import Image from 'next/image'
import './footer.css'
import { usePathname } from 'next/navigation'
import CartFooter from './_component/cart-footer'
// ==== icons ====
import { FaFacebook, FaInstagramSquare, FaYoutube } from 'react-icons/fa'
import {
  BsInstagram,
  BsFacebook,
  BsYoutube,
  BsTelephone,
  BsMailbox,
} from 'react-icons/bs'
import Image from 'next/image'

export default function Footer() {
  const pathname = usePathname()

  if (
    pathname.includes('/login') ||
    pathname.includes('register') ||
    pathname.includes('forget-password') ||
    pathname.includes('/forum') ||
    // pathname.includes('/cart') ||
    pathname.includes('dashboard')
  ) {
    if (pathname.includes('cart')) {
      // return <CartFooter />
    }
    return <></>
  }
  return (
    <>
      <footer>
        <div className="main-footer">
          <div className="row main-footer-body gx-0">
            <div className="col-lg-2 col-12 footer-side">
              <div className="footer-side-text">ISLA 你的自由彩妝生活</div>
              <Image
                src={'http://localhost:3005/images/ad/footer-header-left.jpg'}
                alt="footer-ad"
                width={10}
                height={10}
                className="footer-side-img"
              />
            </div>
            <div className="col-lg-10 col-12 row row-cols-lg-2 row-cols-1 g-0 footer-body">
              <div className="row row-cols-lg-4 row-cols-3 footer-header-left g-0 d-lg-flex d-none">
                <ul>
                  <li className="list-title-footer">彩妝</li>
                  <div className="list-items-footer">
                    <Link href="">優惠券專區</Link>
                    <Link href="">所有商品</Link>
                  </div>
                </ul>
                <ul>
                  <li className="list-title-footer">生活</li>
                  <div className="list-items-footer">
                    <Link href="">美妝教室</Link>
                    <Link href="">美妝社群 </Link>
                  </div>
                </ul>
                <ul>
                  <li className="list-title-footer">關於品牌</li>
                  <div className="list-items-footer">
                    <Link href="">ISLA理念</Link>
                    <Link href="">商業合作</Link>
                  </div>
                </ul>
                <div className="blank d-lg-block d-none" />
              </div>
              <div>
                <div className="footer-header-right">
                  {/* contact info */}
                  <div className="contact-info-block px-3">
                    <h3 className="d-md-block d-none contact-info-title">
                      聯絡我們
                    </h3>
                    <div className="contact-info">
                      <div className="contact-info-footer">
                        <div className="contact-info-footer-icon">
                          <BsTelephone />
                        </div>
                        <div className="contact-info-footer-text">
                          (00) 03554798
                        </div>
                      </div>
                      <div className="contact-info-footer">
                        <div className="contact-info-footer-icon">
                          <BsMailbox />
                        </div>
                        <div className="contact-info-footer-text">
                          isla.supple@isla.com
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* social media info */}
                  <div className="source-media-block">
                    <h3>Our Social Media</h3>
                    <div className="band">
                      <div className="logo-footer">ISLA</div>
                      <div className="icons-footer">
                        <div className="icon-footer">
                          <BsFacebook />
                        </div>
                        <div className="icon-footer">
                          <BsInstagram />
                        </div>
                        <div className="icon-footer">
                          <BsYoutube />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row footer-bottom-band p-md-2 p-3 gy-3 main-footer-body">
            <div className="col-md-3 col-12 card-icons"></div>
            <div className="col-md-6 col-12 d-flex justify-content-md-center justify-content-start">
              Copyright ©2025 Taiwan ISLA Co., Ltd. All rights reserved.
            </div>
            <span className="col-md-3 col-12 d-flex justify-content-md-end justify-content-start">
              隱私條款｜條款及細則
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}
