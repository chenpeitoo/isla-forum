'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import './experience-card.css'
import { useAuth } from '@/hook/use-auth'
import LoginModal from '../../_components/login-modal'
import { toast } from 'react-toastify'

export default function ExperienceCard({
  id = '',
  picture = '',
  tag = '',
  title = '',
  city = '',
  activity_data = '',
  price = 0,
  discount = 0,
  status = '',
}) {
  const tagLabel =
    tag === 1 || tag === '1' ? '課程' : tag === 2 || tag === '2' ? '體驗' : tag

  const [isFavorited, setIsFavorited] = useState(false)
  const [hover, setHover] = useState(false)
  const [animate, setAnimate] = useState(false)
  const { user } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const cardRef = useRef(null)

  // ✅ 初始化收藏狀態
  useEffect(() => {
    if (user?.id) {
      const stored =
        localStorage.getItem(`experience_favorite_${id}`) === 'true'
      setIsFavorited(stored)
    }
  }, [id, user])

  // ✅ 登入後自動觸發收藏與滾動
  useEffect(() => {
    const pending = localStorage.getItem('pendingExperienceFavorite')
    if (user?.id && String(pending) === String(id)) {
      localStorage.removeItem('pendingExperienceFavorite')
      toggleFavorite(true)
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 300)
    }
  }, [user])

  // ✅ 切換收藏狀態
  const toggleFavorite = async (fromAutoLogin = false) => {
    if (!user || !user.id) {
      localStorage.setItem('redirectAfterLogin', window.location.href)
      localStorage.setItem('pendingExperienceFavorite', id)
      setShowLoginModal(true)
      return
    }

    const newState = !isFavorited
    setIsFavorited(newState)
    localStorage.setItem(`experience_favorite_${id}`, newState.toString())
    setAnimate(true)
    setTimeout(() => setAnimate(false), 400)

    const token = localStorage.getItem('jwtToken')

    try {
      const res = await fetch('http://localhost:3005/api/course/wishlist', {
        method: newState ? 'POST' : 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          courses_experience_id: id,
        }),
      })

      const contentType = res.headers.get('content-type')
      if (!res.ok || !contentType?.includes('application/json')) {
        const rawText = await res.text()
        throw new Error(`收藏失敗：${res.status} ${rawText}`)
      }

      const data = await res.json()
      console.log('收藏結果', data)

      if (fromAutoLogin) {
        toast.success('已自動加入收藏！')
      } else {
        if (newState) {
          toast.success('已加入收藏！')
        } else {
          toast.info('已取消收藏！')
        }
      }
    } catch (err) {
      console.error('收藏失敗', err.message)
    }
  }

  return (
    <div
      className="col mb-5"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      ref={cardRef}
    >
      <Link
        href={`/course/experience/${id}`}
        className="text-decoration-none course-card-animate"
      >
        <div
          className="card h-100 card-hover-course course-card"
          data-course-id={id}
        >
          <div className="card-img-container-course position-relative">
            <Image
              src={picture}
              height={450}
              width={800}
              className="card-img-top-course"
              alt={title || '課程圖片'}
            />
            <button
              className="heart-icon-course"
              style={{ opacity: hover || isFavorited ? 1 : 0 }}
              onClick={(e) => {
                e.preventDefault()
                toggleFavorite()
              }}
            >
              <i
                className={`bx ${
                  isFavorited ? 'bxs-heart active' : 'bx-heart'
                } ${animate ? 'animate-pop' : ''}`}
              />
            </button>
          </div>
          <div className="card-body experience-card-body">
            <button className="btn experience-tag mb-2">{tagLabel}</button>
            <h5 className="card-title card-title-box mb-2">{title}</h5>
            <p className="card-teacher-course mb-2">
              <i className="bi bi-geo-alt me-1" />
              {city}
            </p>
            <p className="card-teacher-course mb-2">{activity_data}</p>
            <div className="d-flex align-items-end text-end experience-money">
              <h5 className=" me-3">NT {Number(discount).toLocaleString()}</h5>
              <p className="card-text-price m-0">
                NT {Number(price).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </Link>

      {/* 登入提示 Modal */}
      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  )
}
