'use client'

import Link from 'next/link'
// cart footer
import styles from './footer.module.scss'

export default function CartFooter() {
  return (
    <>
      <footer className={`${styles['footer']} d-none d-lg-block`}>
        <div>
          <div className="row">
            <div
              className={`col-2 d-lg-flex d-none ${styles['footer-side']}`}
            />
            <div
              className={`col-lg-10 col-12 row row-cols-lg-2 row-cols-1 g-0 ${styles['footer-body']}`}
            >
              <div
                className={`row row-cols-lg-4 row-cols-3 g-0 ${styles['footer-header-left']}`}
              >
                <ul>
                  <li className={styles['list-title']}>彩妝</li>
                  <li>
                    <Link href="">優惠券專區</Link>
                  </li>
                  <li>
                    <Link href="">所有商品</Link>
                  </li>
                </ul>
                <ul>
                  <li className={styles['list-title']}>生活</li>
                  <li>
                    <Link href="">美妝教室</Link>
                  </li>
                  <li>
                    <Link href="">美妝社群</Link>
                  </li>
                </ul>
                <ul>
                  <li className={styles['list-title']}>關於品牌</li>
                  <li>
                    <Link href="">ISLA理念</Link>
                  </li>
                  <li>
                    <Link href="">商業合作</Link>
                  </li>
                </ul>
                <div className={`d-lg-block d-none ${styles['blank']}`} />
              </div>
              <div>
                <div className={styles['footer-header-right']}>
                  <div className={styles['contact-info-block']}>
                    <h3 className="d-md-block d-none">聯絡窗口</h3>
                    <div className={styles['contact-info']}>
                      <span>電話 (00) 03554798</span>
                      <span>電子郵件 isla.supple@isla.com</span>
                    </div>
                  </div>
                  <div className={styles['source-media-block']}>
                    <h3>Our Social Media</h3>
                    <div className={styles['band']}>
                      <div className={styles['logo']}>ISLA</div>
                      <div className={styles['icons']}>
                        <button />
                        <button />
                        <button />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`row p-md-2 p-3 gy-3 ${styles['footer-bottom-band']}`}
          >
            <div className={`col-md-3 col-12 ${styles['card-icons']}`}></div>
            <span className="col-md-6 col-12 d-flex justify-content-md-center justify-content-start">
              Copyright ©2025 Taiwan ISLA Co., Ltd. All rights reserved.
            </span>
            <span className="col-md-3 col-12 d-flex justify-content-md-end justify-content-start">
              隱私條款｜條款及細則
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}
