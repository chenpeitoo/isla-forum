'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ExperienceCard from '../../../course/_components/experience-card/experience-card'
import Image from 'next/image'
import '../../_components/experience-list.css'
import Link from 'next/link'
import { useAuth } from '@/hook/use-auth'
import { toast } from 'react-toastify'
import DOMPurify from 'dompurify'
import CalendarButton from '@/app/course/_components/calendar-button/calendar-button'
import CountdownTimer from '@/app/course/_components/countdown-timer/countdown-timer'
import LoginModal from '../../../course/_components/login-modal'
import Breadcrumb from '../../_components/breadcrumb/breadcrumb'
import LoadingLottie from '../../../_components/loading/lottie-loading'
import LoadingErrorLottie from '../../../_components/loading-error/lottie-error'
import { COURSE_BANNER_URL } from '@/_route/img-url'
import { TEACHER_URL } from '@/_route/img-url'

export default function ExperienceIDPage() {
  const params = useParams()
  const id = params.experienceID

  const [experienceCard, setExperienceCard] = useState([])
  const [loaded, setLoaded] = useState(false)
  const { user, isAuth } = useAuth()
  const [isFavorited, setIsFavorited] = useState(false)
  const [animate, setAnimate] = useState(false)
  const router = useRouter()
  const introRef = useRef(null)
  const [experience, setExperience] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [data, setData] = useState([])
  const toggleRef = useRef(null)
  const sectionRef = useRef(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const handleBuyNow = async () => {
    if (!user || !user.id) {
      toast.info('請先登入會員才能購買')
      localStorage.setItem('redirectAfterLogin', window.location.href)
      localStorage.setItem('pendingBuyNow', id)
      localStorage.setItem('pendingBuyNowType', 'experience')
      router.push('/member/login')
      return
    }

    const token = localStorage.getItem('jwtToken')
    try {
      const res = await fetch('http://localhost:3005/api/cart-items/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          course_experience_id: Number(id),
          quantity: 1,
        }),
      })

      const result = await res.json()
      if (result.status === 'success') {
        toast.success('已加入購物車，前往結帳')
        router.push('/cart')
      } else {
        toast.error(result.message || '加入購物車失敗')
      }
    } catch (err) {
      toast.error('發生錯誤，請稍後再試')
    }
  }

  const handleAddToCart = async () => {
    if (!user || !user.id) {
      toast.info('請先登入會員才能加入購物車')
      setShowLoginModal(true)
      return
    }

    const token = localStorage.getItem('jwtToken')
    try {
      const res = await fetch('http://localhost:3005/api/cart-items/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          course_experience_id: Number(id),
          quantity: 1,
        }),
      })

      const result = await res.json()
      if (result.status === 'success') {
        toast.success('已加入購物車')
      } else {
        toast.error(result.message || '加入購物車失敗')
      }
    } catch (err) {
      toast.error('發生錯誤，請稍後再試')
    }
  }

  useEffect(() => {
    const pendingFavorite = localStorage.getItem('pendingFavorite')

    // 若已登入、且收藏過的 ID 符合目前頁面，觸發收藏
    if (user?.id && pendingFavorite === id) {
      localStorage.removeItem('pendingFavorite')
      toggleFavorite()
      // 可選：自動捲動到收藏區塊
      introRef?.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [user])

  const toggleFavorite = async (fromAutoLogin = false) => {
    if (!user || !user.id) {
      toast.info('請先登入會員才能收藏')
      localStorage.setItem('redirectAfterLogin', window.location.href)
      localStorage.setItem('pendingFavorite', id)
      setShowLoginModal(true)
      return
    }

    const newState = !isFavorited
    setIsFavorited(newState)
    localStorage.setItem(`favorite_detail_${id}`, newState.toString())
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
        body: JSON.stringify({ user_id: user.id, courses_experience_id: id }),
      })

      const contentType = res.headers.get('content-type')
      if (!res.ok || !contentType?.includes('application/json'))
        throw new Error('儲存失敗或格式錯誤')

      const result = await res.json()
      toast[fromAutoLogin ? 'success' : newState ? 'success' : 'info'](
        fromAutoLogin
          ? '已自動加入收藏！'
          : newState
            ? '已加入收藏！'
            : '已取消收藏！'
      )
    } catch (err) {
      console.error('收藏失敗', err.message)
    }
  }

  useEffect(() => {
    async function getExperienceCards() {
      try {
        const res = await fetch(`http://localhost:3005/api/course/experience`)
        const result = await res.json()
        if (result.status === 'success') setExperienceCard(result.data ?? [])
        else console.warn('取得推薦體驗課程失敗:', result.message)
      } catch (error) {
        console.error('推薦體驗課程載入失敗:', error)
      }
    }
    if (id) getExperienceCards()
  }, [id])

  useEffect(() => {
    async function getExperienceList() {
      const token = localStorage.getItem('jwtToken')
      try {
        const res = await fetch(
          `http://localhost:3005/api/course/experience-list/${id}`,
          {
            method: 'GET',
            headers: token
              ? {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                }
              : { 'Content-Type': 'application/json' },
          }
        )
        const result = await res.json()
        if (result.status === 'success') {
          setData(result.data || [])
          setLoading(false)
        } else {
          setError(true)
          setLoading(false)
        }
      } catch (err) {
        console.error('資料取得失敗：', err)
        setError(true)
        setLoading(false)
      }
    }
    if (id) getExperienceList()
  }, [id])

  useEffect(() => {
    const pendingBuyNow = localStorage.getItem('pendingBuyNow')
    if (user?.id && pendingBuyNow === id) {
      localStorage.removeItem('pendingBuyNow')
      handleBuyNow() // ✅ 登入後自動執行購買流程
    }
  }, [user])

  if (error) {
    return (
      <div className="loading-container">
        <LoadingErrorLottie />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="loading-container">
        <LoadingLottie />
      </div>
    )
  }

  return (
    <>
      <section>
        {data.length > 0 &&
          data.map((v) => (
            <div
              className="d-flex flex-column justify-content-center text-bg-dark overflow-hidden position-relative "
              key={`box1-${v.id}`}
            >
              <Image
                src={COURSE_BANNER_URL + `${v.picture}`}
                alt="課程圖片"
                width={800}
                height={450}
                className="card-img-top-course"
              />
              <div className="card-img-overlay banner-img-mask-course">
                <div className="row d-lg-flex d-none">
                  <div className="bread-crumbs mt-3 ms-5">
                    <Breadcrumb type="experience" path={id} />
                  </div>
                </div>
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-end p-xl-4 p-lg-3 p-md-2 p-sm-1 p-0">
                  <div className="container">
                    <Link href={`/course/teacher/${v.id}`}>
                      <div className="banner-author my-xl-4 my-2 px-4">
                        <Image
                          src={TEACHER_URL + `${v.teacher_avatar}`}
                          alt="講師圖片"
                          width={50}
                          height={50}
                          className="banner-author-img me-2"
                        />
                        <p className="banner-author-name my-auto">
                          {v.teacher_name}
                        </p>
                      </div>
                    </Link>
                    <h1 className="text-white banner-h1 my-xl-4 my-2 fw-bold">
                      {v.title}
                    </h1>
                    <div className="d-flex banner-ctabox my-xl-4 my-2 d-lg-flex d-none">
                      <button
                        type="button"
                        className="btn btn-primary  px-lg-5 px-4 py-2 me-4 "
                        onClick={handleBuyNow}
                      >
                        立即購買 NT$ {Number(v.discount).toLocaleString()}
                      </button>
                      <p className=" text-white mb-0 text-decoration-line-through text-nowrap  me-4 align-content-center">
                        NT$ {Number(v.price).toLocaleString()}
                      </p>
                      <button
                        onClick={() => toggleFavorite()}
                        className="bg-transparent border-0 p-0 heart-icon"
                      >
                        <i
                          className={`bx ${isFavorited ? 'bxs-heart active' : 'bx-heart'} ${animate ? 'animate-pop' : ''}`}
                        />
                      </button>
                    </div>
                    <div className="d-flex banner-ctabox my-xl-4 my-2 d-lg-none">
                      {/* 收藏按鈕 */}
                      <button
                        type="button"
                        onClick={() => toggleFavorite()}
                        className="bg-transparent border-0 p-0 d-flex align-items-center hover-btn"
                        style={{ cursor: 'pointer' }}
                      >
                        <i
                          className={`bx ${isFavorited ? 'bxs-heart active' : 'bx-heart'} fs-6 fw-bold me-2`}
                        />
                        <span className="fs-6 fw-bold text-white">
                          {isFavorited ? '已收藏' : '收藏'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </section>

      <section className="box2 container my-5">
        {data.length > 0 &&
          data.map((v) => (
            <div className="row" key={`box2-${v.id}`}>
              <div className="col-lg-9 col">
                {/* box1 */}
                <section className="">
                  <div className="container">
                    <div>
                      <div className="card my-3">
                        <div className="card-body">
                          <button className="card-text experience-tag">
                            彩妝體驗
                          </button>
                          <div className="card-text">
                            <ul className="list-unstyled">
                              <li className="text-start py-1 d-flex justify-content-start align-items-center">
                                <i className="bi bi-calendar2-check box1-icon me-2" />
                                <div className="me-3">{v.activity_data}</div>
                                <CalendarButton
                                  activityData={v.activity_data}
                                  title={v.title}
                                  location={v.event_addrees}
                                />
                              </li>
                              <li className="text-start py-1 d-flex  card-text justify-content-start align-items-center ">
                                <i className="bi bi-geo-alt box1-icon me-2" />
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.event_addrees)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="d-flex align-items-center me-3 text-dark fw-normal "
                                >
                                  <div>{v.event_addrees}</div>
                                  <div className="text-center box1-icon ms-2">
                                    <i className="bi bi-box-arrow-up-right text-dark fw-normal" />
                                  </div>
                                </a>
                              </li>
                              <li className="text-start py-1 d-flex justify-content-start align-items-center">
                                <i className="bi bi-ticket-perforated box1-icon me-2" />
                                <div className="me-3">
                                  售票時間 : {v.created} - {v.remove}
                                </div>
                                <div className="box1-mark text-center">
                                  <CountdownTimer endTime={v.remove} />
                                </div>
                              </li>
                              <li className="text-start py-1 d-flex justify-content-start align-items-center">
                                <i className="bi bi-link-45deg box1-icon me-2" />
                                {v.link && (
                                  <Link
                                    href={v.link}
                                    className="me-3 text-decoration-none"
                                  >
                                    <div className="box1-icon text-center text-dark fw-normal">
                                      相關活動
                                      <i className="bi bi-box-arrow-up-right ps-3" />
                                    </div>
                                  </Link>
                                )}
                              </li>
                            </ul>
                          </div>
                          <hr />
                          <p className="card-text">{v.detail}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* box3 */}
                <div className="px-0 my-5">
                  <div className="d-flex ms-2">
                    <div className="title-mark me-2" />
                    <h3>活動介紹</h3>
                  </div>
                  <div className="position-relative" id="box3-expand-section">
                    <div
                      ref={toggleRef}
                      className={`box3-content-collapse position-relative ${isExpanded ? 'expanded' : ''}`}
                      id="box3-collapseContent"
                    >
                      <div
                        className="m-4 text-color"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(v.content, {
                            ALLOWED_TAGS: [
                              'p',
                              'b',
                              'strong',
                              'i',
                              'em',
                              'ul',
                              'ol',
                              'li',
                              'br',
                              'img',
                              'h1',
                              'h2',
                              'h3',
                              'h4',
                              'a',
                            ],
                            ALLOWED_ATTR: ['src', 'href', 'alt', 'title'],
                          }),
                        }}
                      />
                      {/* 遮罩 */}
                      {!isExpanded && (
                        <div
                          className="box3-fade-mask position-absolute bottom-0 start-0 w-100"
                          id="box3-fadeMask"
                        />
                      )}
                    </div>
                    {/* 按鈕 */}
                    <div className="text-center mt-3">
                      <button
                        className="more-courses-toggle d-flex align-items-center justify-content-center mx-auto"
                        onClick={() => {
                          if (isExpanded && toggleRef.current) {
                            toggleRef.current.scrollIntoView({
                              behavior: 'smooth',
                              block: 'start',
                            })
                          }
                          setIsExpanded((prev) => !prev)
                        }}
                        style={{
                          cursor: 'pointer',
                          border: 'none',
                          background: 'transparent',
                          fontWeight: 'bold',
                          fontSize: '1.2rem',
                          color: 'var(--main-color)',
                        }}
                      >
                        {isExpanded ? '收起課程' : '展開全部'}
                        <i
                          className="bx bx-chevron-down fs-4 ms-2"
                          style={{
                            transform: isExpanded
                              ? 'rotate(180deg)'
                              : 'rotate(0deg)',
                            transition: 'transform 0.3s',
                          }}
                        />
                      </button>
                    </div>
                  </div>
                </div>
                {/* box4*/}
                <div className="px-0 my-5">
                  <div className="d-flex ms-2">
                    <div className="title-mark me-2" />
                    <h3>關於講師</h3>
                  </div>
                </div>
                <Link href={`/course/teacher/${v.id}`}>
                  <div className="card px-0">
                    <div className="row g-0">
                      <div className="col-md-4">
                        <Image
                          src={TEACHER_URL + `${v.teacher_avatar}`}
                          alt="講師圖片"
                          width={800}
                          height={450}
                          className="w-100 h-100 object-fit-cover rounded-start"
                        />
                      </div>
                      <div className="col-md-8">
                        <div className="card-body h-100 position-relative">
                          <h3 className="card-title box4-card-title">
                            {v.teacher_name}
                          </h3>
                          <div className="row d-flex m-0 my-3 box4-card-text">
                            <div className="col text-start p-0">
                              <div className="">
                                <i className="bx bx-slideshow" /> 1堂課程
                              </div>
                            </div>
                            <div className="col text-start p-0">
                              <div className="">
                                <i className="bx bx-spreadsheet" /> 1篇文章
                              </div>
                            </div>
                            <div className="col text-start p-0">
                              <div className="">
                                <i className="bi bi-people me-2" />
                                333位學生
                              </div>
                            </div>
                          </div>
                          <hr />
                          <div
                            className="card-text box4-card-text mb-4"
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(v.teacher_about, {
                                ALLOWED_TAGS: [
                                  'p',
                                  'b',
                                  'strong',
                                  'i',
                                  'em',
                                  'ul',
                                  'ol',
                                  'li',
                                  'br',
                                  'img',
                                  'h1',
                                  'h2',
                                  'h3',
                                  'h4',
                                  'a',
                                ],
                                ALLOWED_ATTR: ['src', 'href', 'alt', 'title'],
                              }),
                            }}
                          />
                          <div className="card-text text-end my-auto position-absolute bottom-0 end-0">
                            <small className="More-teacher">
                              前往講師頁面
                              <i className="bx bx-chevron-right" />
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-lg-3 d-none d-lg-block">
                <div className="px-0 scroll-card">
                  {/* scroll-card */}
                  <div className="card card-style">
                    <div className="card-body scroll-card-text">
                      <div className="row d-flex justify-content-center align-items-center my-3 mx-0">
                        <p className="col-xxl-8 text-xxl-start text-center scroll-card-discount fs-3 mb-0">
                          NT$ {Number(v.discount).toLocaleString()}
                        </p>
                        <p className="col text-xxl-start text-center mb-0 text-decoration-line-through text-nowrap p-0">
                          NT$ {Number(v.price).toLocaleString()}
                        </p>
                      </div>
                      <div className="d-flex justify-content-center align-items-end my-4">
                        <button
                          type="button"
                          className="btn btn-primary w-100"
                          onClick={handleBuyNow}
                        >
                          {' '}
                          立即購買{' '}
                        </button>
                      </div>
                      <div className="d-flex justify-content-between align-items-end my-4">
                        <button
                          type="button"
                          className="btn scroll-card-btn btn-lg px-xxl-5 px-lg-4 py-2"
                          onClick={handleAddToCart}
                        >
                          <i className="bi bi-handbag text-center" />
                        </button>
                        <button
                          onClick={() => toggleFavorite()}
                          className="btn scroll-card-btn btn-lg px-xxl-5 px-lg-4 py-2"
                        >
                          <i
                            className={`bx ${isFavorited ? 'bxs-heart active' : 'bx-heart'} text-center fs-4 ${animate ? 'animate-pop' : ''}`}
                          />
                        </button>
                      </div>
                      <h5 className="card-title fw-normal mt-5">關於課程</h5>
                      <hr />
                      <div className="card-text">
                        <ul className="list-unstyled">
                          <li className="text-start py-2">{v.title}</li>
                          <li className="text-start py-2">
                            <i className="bi bi-calendar2-check scroll-card-icon me-1" />{' '}
                            {v.activity_data}
                          </li>
                          <li className="text-start py-2">
                            <i className="bi bi-geo-alt scroll-card-icon me-1" />
                            {v.event_addrees}
                          </li>
                          <li className="text-start py-2">
                            <i className="bi bi-ticket-perforated scroll-card-icon me-1" />
                            售票時間 : {v.created} - {v.remove}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </section>
      {/* price-sticky-bar */}
      <section>
        {data.length > 0 &&
          data.map((v) => (
            <div
              className="price-sticky-bar sticky-bar-style d-lg-none w-100"
              key={`price-sticky-bar-${v.id}`}
            >
              <div className="d-flex justify-content-between align-items-center px-3">
                <div className="row my-1 mx-0">
                  <div className="col d-flex flex-column justify-content-center align-items-center text-center">
                    <p className="mb-1 text-decoration-line-through text-muted text-nowrap scroll-card-text">
                      NT$ {Number(v.price).toLocaleString()}
                    </p>
                    <p className="scroll-card-discount fs-2 mb-0">
                      {' '}
                      NT$ {Number(v.discount).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  className="btn px-4 scroll-card-btn"
                  onClick={handleAddToCart}
                >
                  <i className="bi bi-handbag text-center" />
                </button>
                <button
                  className="btn btn-primary flex-grow-1 mx-2"
                  onClick={handleBuyNow}
                >
                  立即購買
                </button>
              </div>
            </div>
          ))}
      </section>
      {/* box5-map*/}
      {data.length > 0 &&
        data.map((v) => (
          <div className="container" key={`map-${v.id}`}>
            <div className="px-0 my-5">
              <div className="d-flex ms-2">
                <div className="title-mark me-2" />
                <h3>活動地址</h3>
              </div>
            </div>
            <div className="ratio ratio-16x9 mb-3">
              <iframe
                title="This is a map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3674.768117034821!2d120.22534507605985!3d22.92192217924442!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e74ed73deb36b%3A0x4593854ee0a76b3d!2zNzE3MTDlj7DljZfluILku4HlvrfljYDkuozku4Hot6_kuIDmrrU2MOiZnw!5e0!3m2!1szh-TW!2stw!4v1747106350349!5m2!1szh-TW!2stw"
                width={400}
                height={300}
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="text-center box5-map-h1 my-5">
              <i className="bi bi-pin-map me-2" /> {v.event_addrees}
            </p>
          </div>
        ))}
      <section className="box-6 container">
        <hr />
        <div className="px-0 my-5">
          <div className="d-flex ms-2">
            <div className="title-mark me-2" />
            <h3>相關課程推薦</h3>
          </div>
        </div>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-lg-4 g-4 p-0 m-0 my-4">
          {experienceCard
            .filter((v) => v.status != 0 && v.status != '0')
            .slice(0, 4)
            .map((v, i) => (
              <ExperienceCard
                key={`exp-${v.id}-${v.title}`}
                id={v.id}
                picture={COURSE_BANNER_URL + v.picture}
                tag={v.tag}
                title={v.title}
                city={v.city}
                activity_data={v.activity_data}
                price={v.price}
                discount={v.discount}
              />
            ))}
        </div>
      </section>
      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        // handleBuyNow={handleBuyNow}
      />
    </>
  )
}
