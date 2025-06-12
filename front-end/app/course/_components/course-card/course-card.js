'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import './course-card.css'
import { useAuth } from '@/hook/use-auth'
import LoginModal from '../../_components/login-modal'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

export default function CourseCard({
  id = '',
  picture = '',
  tag = '',
  title = '',
  teacher = '',
  avg_star = 0,
  comment_count = 0,
  student = 0,
  price = 0,
  discount = 0,
  status = 0,
  categories_id = 0,
  teacher_name = '',
}) {
  const tagLabel =
    tag === 1 || tag === '1' ? '課程' : tag === 2 || tag === '2' ? '體驗' : tag

  const [isFavorited, setIsFavorited] = useState(false)
  const [hover, setHover] = useState(false)
  const [animate, setAnimate] = useState(false)
  const { user } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const cardRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    if (user && user.id) {
      const stored = localStorage.getItem(`favorite_${id}`) === 'true'
      setIsFavorited(stored)
    }
  }, [id, user])

  useEffect(() => {
    const pending = localStorage.getItem('pendingFavorite')
    if (user?.id && String(pending) === String(id)) {
      localStorage.removeItem('pendingFavorite')
      toggleFavorite(true)
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 300)
    }
  }, [user])

  const toggleFavorite = async (fromAutoLogin = false) => {
    if (!user || !user.id) {
      localStorage.setItem('redirectAfterLogin', window.location.href)
      localStorage.setItem('pendingFavorite', id)
      setShowLoginModal(true)
      return
    }

    const newState = !isFavorited
    setIsFavorited(newState)
    localStorage.setItem(`favorite_${id}`, newState.toString())
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
          courses_id: id,
        }),
      })

      const contentType = res.headers.get('content-type')
      if (!res.ok || !contentType?.includes('application/json')) {
        throw new Error('儲存失敗或格式錯誤')
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

  if (tag === 0 || tag === '0') return null

  const renderStars = (score) => {
    const ratingNum = Number(score)
    const fullStars = Math.floor(ratingNum)
    const halfStar = ratingNum % 1 >= 0.5
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <i className="bx bxs-star" key={`full-${i}`} />
        ))}
        {halfStar && <i className="bx bxs-star-half" key="half" />}
        {[...Array(emptyStars)].map((_, i) => (
          <i className="bx bx-star" key={`empty-${i}`} />
        ))}
      </>
    )
  }

  return (
    <div
      className="col mb-5"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      ref={cardRef}
    >
      <Link
        href={`/course/course-list/${id}`}
        className="text-decoration-none course-card-animate"
      >
        <div
          className="card h-100 card-hover-course course-card"
          data-course-id={id}
        >
          <div className="card-img-container-course position-relative">
            <Image
              src={picture}
              alt={title || '課程圖片'}
              width={800}
              height={450}
              className="card-img-top-course"
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
          <div className="card-body course-card-body">
            <button className="btn card-btn-course mb-2">{tagLabel}</button>
            <h5 className="card-title card-title-box mb-2">{title}</h5>
            <p className="card-teacher-course mb-2">{teacher_name}</p>

            <div className="d-flex align-content-center">
              <div className="mb-2 me-3 card-score-course">
                {avg_star.toFixed(1)} {renderStars(avg_star)}
              </div>
              <div className="d-flex">
                <i className="bi bi-people me-2" />
                <div className="card-people-course">
                  {Number(student).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="d-flex align-items-end text-end course-money">
              <h5 className=" me-3 fw-bold">
                NT$ {Number(discount).toLocaleString()}
              </h5>
              <p className="card-text-price m-0">
                $ {Number(price).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </Link>
      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  )
}
