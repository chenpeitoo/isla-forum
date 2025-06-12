'use client'

import Image from 'next/image'
import Link from 'next/link'
// ==== route ====
import { USER_AVA_URL } from '@/_route/img-url'
import { FORUM_PAGE_URL } from '@/_route/page-url'
// ==== css ====
import '../_style/forum.css' // 卡片css

export default function ForumBar({ forum = {}, setHamMenuOpen = () => {} }) {
  console.log(forum.content)
  return (
    <>
      <Link
        className="w-100 main-text-color d-flex align-item-center"
        href={FORUM_PAGE_URL + forum.id}
        onClick={() => {
          setHamMenuOpen(false)
        }}
      >
        {/* ==== card ==== */}
        <div className="header-search-item for-forum d-flex flex-column w-100">
          <div className="d-flex flex-column justify-content-between gap-2 w-100">
            {/* ==== auth-info ==== */}
            <div className="header-search-item-ForumBar-container">
              <div className="search-item-img rounded-pill overflow-hidden">
                <Image
                  src={USER_AVA_URL + forum.ava_img}
                  alt="item"
                  width={25}
                  height={25}
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="search-item-content">{forum.nickname}</div>
            </div>
            {/* ==== title ==== */}
            <div className="search-item-title w-100">
              {forum.title.slice(0, 100)}
            </div>
          </div>
          {/* ==== Content ==== */}
          {/* <div
          className="post-content text-truncate fs14 px-4 w-100"
          dangerouslySetInnerHTML={{
            __html:
              forum.content
                ?.replace(/<img\b[^>]*>/g, '')
                .replace('<br/>', ' ')
                .slice(0, 100) || '',
          }}
        /> */}
        </div>
      </Link>
    </>
  )
}
