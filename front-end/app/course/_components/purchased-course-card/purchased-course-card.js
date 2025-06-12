'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { useAuth } from '@/hook/use-auth'
import LoginModal from '../../_components/login-modal'
import './purchased-course-card.css'
import { COURSE_BANNER_URL } from '@/_route/img-url'

export default function PurchasedCourseCard({ course }) {
  const { auth, showLoginModal } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [showLogin, setShowLogin] = useState(false)

  // ✅ 初始化 localStorage 收藏狀態
  useEffect(() => {
    const stored = localStorage.getItem('favorites')
    if (stored) setFavorites(JSON.parse(stored))
  }, [])

  const isFavorited = favorites.includes(course.id)

  // ✅ 收藏或取消收藏
  const toggleFavorite = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!auth?.isLoggedIn) {
      setShowLogin(true)
      return
    }

    try {
      let newFavorites = [...favorites]
      if (isFavorited) {
        await fetch(`/api/favorites/${course.id}`, { method: 'DELETE' })
        newFavorites = favorites.filter((id) => id !== course.id)
        toast.info('已取消收藏')
      } else {
        await fetch(`/api/favorites`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ course_id: course.id }),
        })
        newFavorites.push(course.id)
        toast.success('收藏成功')
      }
      setFavorites(newFavorites)
      localStorage.setItem('favorites', JSON.stringify(newFavorites))
    } catch (err) {
      toast.error('操作失敗，請稍後再試')
    }
  }

  const href =
    course.type === '體驗'
      ? `/course/experience/${course.id}`
      : `/course/course-list/${course.id}`

  return (
    <div className="col mb-5">
      <Link href={href} className="text-decoration-none course-card-animate">
        <div className="card h-100 card-hover-course course-card">
          <div className="card-img-container-course">
            <Image
              src={COURSE_BANNER_URL + `${course.picture}`}
              alt="課程圖片"
              width={800}
              height={450}
              className="card-img-top-course"
            />
            <div
              className="heart-icon-course"
              onClick={toggleFavorite}
              onKeyDown={(e) => e.key === 'Enter' && toggleFavorite(e)}
              role="button"
              tabIndex={0}
              aria-label="切換收藏狀態"
            >
              <i
                className={
                  isFavorited ? 'bx bxs-heart text-danger' : 'bx bx-heart'
                }
              />
            </div>
          </div>
          <div className="card-body teacher-card-body">
            <button
              className={`btn mb-2 ${
                course.tag === 2 ? 'experience-tag' : 'card-btn-course'
              }`}
            >
              {course.type}
            </button>
            <h5 className="card-title mb-2 clamp-2-lines">{course.title}</h5>
            <p className="card-teacher-course mb-2">{course.teacher_name}</p>
            <div className="d-flex align-items-end text-end teacher-money">
              <h5 className="me-3">
                NT {Number(course.discount).toLocaleString()}
              </h5>
              <p className="card-text-discount m-0">
                NT {Number(course.price).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </Link>
      <LoginModal show={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  )
}
