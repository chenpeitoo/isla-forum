'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MdOutlineCenterFocusStrong } from 'react-icons/md'
import './course-banner.css'
import { COURSE_BANNER_URL } from '@/_route/img-url'

export default function CourseBanner() {
  const [imgFirst, setImgFirst] = useState(1)
  const [imgMid, setImgMid] = useState(2)
  const [imgLast, setImgLast] = useState(3)

  const currentImgs = [{ id: imgFirst }, { id: imgMid }, { id: imgLast }]

  // 自動輪播
  useEffect(() => {
    const intervalId = setInterval(() => {
      setImgFirst((prev) => (prev % 6) + 1)
      setImgMid((prev) => (prev % 6) + 1)
      setImgLast((prev) => (prev % 6) + 1)
    }, 3000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <section className="banner align-content-center justify-content-center py-sm-5 py-0">
      <div className="d-flex">
        {/* 左：上一張 */}
        <button
          className="carousel-button prev"
          onClick={() => {
            setImgFirst((prev) => (prev === 1 ? 6 : prev - 1))
            setImgMid((prev) => (prev === 1 ? 6 : prev - 1))
            setImgLast((prev) => (prev === 1 ? 6 : prev - 1))
          }}
        >
          ‹
        </button>

        {/* 右：下一張 */}
        <button
          className="carousel-button next"
          onClick={() => {
            setImgFirst((prev) => (prev % 6) + 1)
            setImgMid((prev) => (prev % 6) + 1)
            setImgLast((prev) => (prev % 6) + 1)
          }}
        >
          ›
        </button>
      </div>

      <p className="d-flex align-items-center d-lg-none box1-p mt-sm-0 my-sm-0 my-4 ms-2 fs-3">
        <MdOutlineCenterFocusStrong className="me-2" />
        精選課程
      </p>

      <div className="banner-image-wrapper py-sm-5">
        {currentImgs.map((img, i) => (
          <div className={i === 1 ? 'box1-img1' : 'box1-img'} key={i}>
            <span className="" />
            <Image
              src={COURSE_BANNER_URL + `banner${img.id}.jpg`}
              alt={`Course banner ${img.id}`}
              width={100}
              height={100}
              className="responsive-img"
            />
            <Link
              href={`/course/course-list/${img.id}`}
              className="img-overlay-link"
            />
          </div>
        ))}
      </div>

      <div className="justify-content-center d-lg-flex d-none">
        {[...Array(6)].map((_, i) => (
          <button
            key={i}
            className={`box1-dot${i + 1 === imgMid ? ' active' : ''}`}
            onClick={() => {
              const selected = i + 1
              const prev = selected === 1 ? 6 : selected - 1
              const next = selected === 6 ? 1 : selected + 1
              setImgFirst(prev)
              setImgMid(selected)
              setImgLast(next)
            }}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </div>

      <h1 className="box1-banner-title">TRENDING NOW</h1>
    </section>
  )
}
