'use client'

// ✅ Hook 匯入
import { useAuth } from '@/hook/use-auth'
import { useEffect, useState, useRef, useMemo } from 'react'

import React from 'react'

// ✅ 元件與樣式匯入
import CourseCard from '../../../course/_components/course-card/course-card'
import { courseUrl } from '../../../../_route/courseUrl'
import Image from 'next/image'
import '../../_components/course-list.css'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import ReviewModal from '../../../course/_components/review-modal/review-modal'
import CommentsCard from '../../../course/_components/comments-card/comments-card'
import useRatingSummary from '../../../../hook/use-rating-summary'
import { renderStars } from '../../../utils/renderStars'
import StarFilterBar from '../../../course/_components/review-star-filter-bar/review-star-filter-bar'
import AddReviewForm from '../../../course/_components/add-review-form/add-review-form'
import { toast } from 'react-toastify'
import EditReviewModal from '../../../course/_components/edit-review-modal/edit-review-modal'
import LoginModal from '../../../course/_components/login-modal'
import { useRouter } from 'next/navigation'
import DOMPurify from 'dompurify'
import Breadcrumb from '../../_components/breadcrumb/breadcrumb'
import LoadingLottie from '../../../_components/loading/lottie-loading'
import LoadingErrorLottie from '../../../_components/loading-error/lottie-error'
import { COURSE_BANNER_URL } from '@/_route/img-url'
import { TEACHER_URL } from '@/_route/img-url'

export default function CourseIDPage() {
  // ✅ 取得動態路由的課程 ID
  const params = useParams()
  const id = params.courseID

  // ✅ 狀態管理
  const [courseCard, setCourseCard] = useState([])
  const [isFavorited, setIsFavorited] = useState(false)
  const [animate, setAnimate] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [reviewCard, setReviewCard] = useState([])
  const [likesMap, setLikesMap] = useState({})
  const [selectedStar, setSelectedStar] = useState(null)
  const [data, setData] = useState([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingComment, setEditingComment] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const sectionRef = useRef(null)
  const { user, isAuth } = useAuth()
  const router = useRouter()
  const introRef = useRef(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const toggleRef = useRef(null)
  const recommendedCourseIds = [1, 7, 8, 19]
  const [highlightedCommentId, setHighlightedCommentId] = useState(null)
  const [sortOption, setSortOption] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const sortedReviews = useMemo(() => {
    const copy = [...reviewCard]
    switch (sortOption) {
      case 2:
        return copy.sort((a, b) => b.star - a.star)
      case 3:
        return copy.sort((a, b) => a.star - b.star)
      case 4:
        return copy.sort((a, b) => new Date(b.created) - new Date(a.created))
      case 5:
        return copy.sort((a, b) => new Date(a.created) - new Date(b.created))
      case 1:
      default:
        return copy.sort((a, b) => (b.is_helpful || 0) - (a.is_helpful || 0))
    }
  }, [reviewCard, sortOption])

  // 新增加入購物車函式
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
          course_id: Number(id),
          quantity: 1,
        }),
      })

      const result = await res.json()
      if (result.status === 'success') {
        window.dispatchEvent(new Event('cart-updated')) //洛特加這一行(為了讓加入購物車後icon數字會更新)
        toast.success('已加入購物車！')
      } else {
        toast.error(result.message || '加入購物車失敗')
      }
    } catch (err) {
      console.error('加入購物車失敗：', err)
      toast.error('發生錯誤，請稍後再試')
    }
  }
  // 立即購買
  const handleBuyNow = async () => {
    if (!user || !user.id) {
      toast.info('請先登入會員才能購買')
      localStorage.setItem('redirectAfterLogin', window.location.href)
      localStorage.setItem('pendingBuyNow', id) // ⭐ 新增這行：記錄課程 ID
      localStorage.setItem('pendingBuyNowType', 'course')
      router.push('/member/login')
      return
    }

    // ✅ 已登入者：正常購買流程
    const token = localStorage.getItem('jwtToken')
    try {
      const res = await fetch('http://localhost:3005/api/cart-items/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          course_id: Number(id),
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
      console.error('立即購買錯誤：', err)
      toast.error('發生錯誤，請稍後再試')
    }
  }
  useEffect(() => {
    const pendingBuyNow = localStorage.getItem('pendingBuyNow')
    if (user?.id && pendingBuyNow === id) {
      localStorage.removeItem('pendingBuyNow')
      handleBuyNow() // 自動加入購物車並跳轉
    }
  }, [user])

  // ✅ 自動觸發收藏（登入後）
  useEffect(() => {
    const pending = localStorage.getItem('pendingFavorite')
    if (user?.id && String(pending) === String(id)) {
      localStorage.removeItem('pendingFavorite')
      toggleFavorite(true)
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }, 300)
    }
  }, [user])

  // ✅ 評價統計資訊
  const { avgStar, starCounts, total } = useRatingSummary(reviewCard)

  // ✅ 分數篩選
  const handleFilterSelect = (level) => {
    setSelectedStar(level === selectedStar ? null : level)
  }

  // ✅ 編輯與刪除評論功能
  const handleEditComment = (id) => {
    const comment = reviewCard.find((v) => v.comment_id === id)
    setEditingComment(comment)
    setIsEditModalOpen(true)
  }

  const handleCommentUpdate = (id, content, star) => {
    setReviewCard((prev) =>
      prev.map((v) => (v.comment_id === id ? { ...v, content, star } : v))
    )
    setHighlightedCommentId(id)
    setTimeout(() => setHighlightedCommentId(null), 3000)
  }
  const handleUpdate = (id, newContent, newStar) => {
    setReviewCard((prev) =>
      prev.map((v) =>
        v.comment_id === id ? { ...v, content: newContent, star: newStar } : v
      )
    )
  }

  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem('jwtToken')
    if (!window.confirm('你確定要刪除這則留言嗎？')) return
    try {
      const res = await fetch(
        `http://localhost:3005/api/course/comments/${commentId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      const result = await res.json()
      if (result.status === 'success') {
        setReviewCard((prev) => prev.filter((v) => v.comment_id !== commentId))
        toast.success('留言已成功刪除！')
      } else {
        toast.error(result.message || '刪除失敗')
      }
    } catch (err) {
      toast.error('刪除過程中發生錯誤')
    }
  }

  // ✅ 收藏課程功能
  const toggleFavorite = async (fromAutoLogin = false) => {
    if (!user || !user.id) {
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
        body: JSON.stringify({ user_id: user.id, courses_id: id }),
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

  // ✅ 按讚留言功能
  const toggleLike = async (commentId) => {
    setLikesMap((prev) => {
      const current = prev[commentId] || { liked: false, count: 0 }
      const newLiked = !current.liked
      const newCount = newLiked ? current.count + 1 : current.count - 1
      localStorage.setItem(`like_${commentId}`, newLiked.toString())
      localStorage.setItem(`likeCount_${commentId}`, newCount.toString())
      return {
        ...prev,
        [commentId]: { liked: newLiked, count: newCount },
      }
    })
    await fetch('http://localhost:3005/api/course/comments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment_id: commentId, is_add: true }),
    })
  }
  // ⭐ Modal 控制開關
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  // ✅ 刪除留言後更新畫面
  const onAfterDelete = (deletedId) => {
    setReviewCard((prev) => prev.filter((v) => v.comment_id !== deletedId))
  }

  // ✅ 登入成功後滾回留言區
  useEffect(() => {
    const pendingScrollToComment = localStorage.getItem(
      'pendingScrollToComment'
    )
    if (user?.id && pendingScrollToComment === id) {
      localStorage.removeItem('pendingScrollToComment')
      toast.success('歡迎回來！您可以撰寫評論囉')
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }, 500)
    }
  }, [user])

  // ✅ 初始化：取得課程資料與留言
  useEffect(() => {
    const stored = localStorage.getItem(`favorite_detail_${id}`) === 'true'
    setIsFavorited(stored)

    async function getCourseList() {
      const token = localStorage.getItem('jwtToken')
      const res = await fetch(
        `http://localhost:3005/api/course/course-list/${id}`,
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
      if (result.status === 'success') setData(result.data)
    }

    async function getReviewCard() {
      const res = await fetch(`${courseUrl}comments?course_id=${id}`)
      const result = await res.json()
      setReviewCard(result.data || [])
      const newLikes = {}
      result.data.forEach((v) => {
        const liked = localStorage.getItem(`like_${v.comment_id}`) === 'true'
        const count =
          parseInt(localStorage.getItem(`likeCount_${v.comment_id}`)) ||
          v.is_helpful ||
          0
        newLikes[v.comment_id] = { liked, count }
      })
      setLikesMap(newLikes)
    }

    async function getCourse() {
      const res = await fetch(courseUrl + 'course')
      const result = await res.json()
      setCourseCard(result.data || [])
    }

    if (id) {
      Promise.all([getCourseList(), getReviewCard(), getCourse()])
        .then(() => setLoading(false))
        .catch((err) => {
          console.error('資料載入錯誤：', err)
          setError(true)
          setLoading(false)
        })
    }
  }, [id])

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
            <section
              key={v.course_id}
              ref={sectionRef}
              className="d-flex flex-column justify-content-center  overflow-hidden position-relative "
            >
              {v.banner_video?.toLowerCase().endsWith('.mp4') ? (
                <video
                  src={COURSE_BANNER_URL + `${v.banner_video}`}
                  width={800}
                  height={200}
                  className="card-img-top-course"
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={`/images/course/bannerall/${v.banner_image || 'default.jpg'}`} // 預設圖片可自行設定
                >
                  您的瀏覽器不支援 HTML5 影片播放。
                </video>
              ) : (
                <Image
                  src={COURSE_BANNER_URL + `${v.banner_video}`}
                  alt={v.title}
                  width={800}
                  height={200}
                  className="card-img-top-course"
                  priority
                />
              )}

              <div className="card-img-overlay banner-img-mask-course">
                <div className="row d-lg-flex d-none">
                  <div className="bread-crumbs mt-3 ms-5">
                    <Breadcrumb type="course" path={id} current={v.title} />
                  </div>
                </div>
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-end p-xl-4 p-lg-3 p-md-2 p-sm-1 p-0">
                  <div className="row position-absolute top-50 end-0 translate-middle-y d-flex align-items-center gap-2 me-5 d-lg-flex d-none banner-play-box">
                    <div
                      className="banner-play-box"
                      role="button"
                      tabIndex={0}
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        introRef.current?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'center',
                        })
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          document
                            .getElementById('intro-video')
                            ?.scrollIntoView({
                              behavior: 'smooth',
                              block: 'center',
                            })
                        }
                      }}
                    >
                      <div className="banner-play-icon">
                        <i className="bx bx-play-circle" />
                      </div>
                      <div>
                        <p className="banner-play-text">觀看介紹影片</p>
                      </div>
                    </div>
                  </div>
                  <div className="container">
                    <Link href={`/course/teacher/${v.id}`}>
                      <div className="banner-author my-xl-4 my-2 px-4">
                        <Image
                          src={TEACHER_URL + `${v.ava_url}`}
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
                        className="btn btn-primary  px-lg-5 px-4 py-2 me-4 text-nowrap"
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
                      {/* 介紹影片按鈕 */}
                      <button
                        type="button"
                        onClick={() => {
                          introRef.current?.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                          })
                        }}
                        className="bg-transparent border-0 p-0 d-flex align-items-center hover-btn me-4"
                        style={{ cursor: 'pointer' }}
                      >
                        <i className="bx bx-play-circle fs-6 fw-bold me-2"></i>
                        <span className="fs-6 fw-bold text-white">
                          介紹影片
                        </span>
                      </button>

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
            </section>
          ))}
      </section>
      {/* box1 */}
      {data.length > 0 &&
        data.map((v) => (
          <div className="box1" key={`box1-${v.course_id}`}>
            <div className="container">
              <div className="row row-cols-2 row-cols-md-4 justify-content-evenly py-md-4 py-3 gy-2 gy-md-0">
                <div className="col text-center">
                  <div className="text-center box1-h1">課程包含</div>
                  <div className="box1-p">{v.course_chapter}</div>
                </div>
                <div className="col text-center">
                  <div className="text-center box1-h1">課程時長</div>
                  <div className="box1-p">{v.video_length}</div>
                </div>
                <div className="col text-center">
                  <div className="text-center box1-h1">學員人數</div>
                  <div className="box1-p">
                    {v.student && Number(v.student) > 0
                      ? `${v.student} 位學員`
                      : '暫無學員'}
                  </div>
                </div>
                <div className="col text-center">
                  <div className="text-center box1-h1">{total} 則評價</div>
                  <div className="box1-p">{renderStars(avgStar)}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      {/* box2 */}
      {data.length > 0 &&
        data.map((v) => (
          <section className="box2 container my-5" key={`box2-${v.course_id}`}>
            <div className="row">
              <div className="col-lg-9 col">
                <div className="px-0">
                  <div className="d-flex ms-2">
                    <div className="title-mark me-2" />
                    <h3>關於課程</h3>
                  </div>
                  {data.length > 0 && (
                    <div className="my-4 text-color">
                      <p>{v.detail}</p>
                      {data[0].banner_video?.toLowerCase().endsWith('.mp4') ? (
                        <video
                          ref={introRef}
                          src={COURSE_BANNER_URL + `${data[0].banner_video}`}
                          width={800}
                          height={200}
                          className="card-img-top-course pt-2"
                          autoPlay
                          muted
                          loop
                          playsInline
                          controls
                          poster={`/images/course/bannerall/${data[0].banner_image || 'default.jpg'}`} // 預設圖片可自行設定
                        >
                          您的瀏覽器不支援 HTML5 影片播放。
                        </video>
                      ) : (
                        <Image
                          ref={introRef}
                          src={COURSE_BANNER_URL + `/${data[0].banner_video}`}
                          alt={data[0].title}
                          width={800}
                          height={200}
                          className="card-img-top-course"
                          priority
                        />
                      )}
                    </div>
                  )}
                </div>
                {/* box3 */}
                <div className="px-0 my-5">
                  <div className="d-flex ms-2 ">
                    <div className="title-mark me-2" />
                    <h3>課程內容</h3>
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
  ALLOWED_TAGS: ['p', 'b', 'strong', 'i', 'em', 'ul', 'ol', 'li', 'br', 'img', 'h1', 'h2', 'h3', 'h4', 'a', 'span', 'div'],
  ALLOWED_ATTR: ['src', 'href', 'alt', 'title', 'style'], // ⭐加入 style 和 class
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
                          src={TEACHER_URL + `${v.ava_url}`}
                          alt="講師圖片"
                          width={800}
                          height={450}
                          className="card-img-top-course"
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
                            <small className="More-teacher pe-3 pb-2">
                              前往講師頁面
                              <i className="bx bx-chevron-right" />
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
                {/* box5-Comment*/}
                <div className="px-0 my-5">
                  <div className="d-flex ms-2">
                    <div className="title-mark me-2" />
                    <h3>課程評價</h3>
                  </div>
                </div>
                <div className="d-flex row">
                  <div className="col-lg-4 d-none d-lg-block">
                    <div className="d-flex justify-content-center align-items-baseline">
                      <div className="text-center box5-comment-h1 fw-bold me-2 my-2">
                        {Number(avgStar).toFixed(1)}
                      </div>
                      <div className="text-center box5-comment-p pe-2">
                        / 5.0
                      </div>
                    </div>
                    <div className="d-flex justify-content-center box5-comment-star fs-5 pt-2">
                      {renderStars(avgStar)}
                    </div>
                    <div className="d-flex justify-content-center">
                      <div className="card-people-course box5-comment-p pt-3">
                        {total} 則評價
                      </div>
                    </div>
                  </div>

                  <div className="d-lg-none">
                    <div className="d-flex align-content-center mb-4">
                      <div className="ms-3 me-4 card-comment-course ">
                        {avgStar} {renderStars(avgStar)}
                      </div>
                      <div className="d-flex">
                        <div className="card-people-course box5-comment-p">
                          {total} 則評價
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-8 col">
                    <StarFilterBar
                      starCounts={starCounts}
                      total={total}
                      selectedStar={selectedStar}
                      onFilterSelect={handleFilterSelect}
                    />
                    {selectedStar && (
                      <div className="text-end my-2">
                        <button
                          className="btn btn-secondary box5-comment-star"
                          onClick={() => setSelectedStar(null)}
                        >
                          清除篩選
                        </button>
                      </div>
                    )}
                  </div>
                  {isAuth ? (
                    <AddReviewForm
                      courseID={id}
                      onReviewAdded={(newReview) => {
                        setReviewCard((prev) => [newReview, ...prev])
                        setLikesMap((prev) => ({
                          ...prev,
                          [newReview.comment_id]: {
                            liked: false,
                            count: newReview.is_helpful || 0,
                          },
                        }))
                        setHighlightedCommentId(newReview.comment_id) // ✅ 強調這則留言
                        setTimeout(() => setHighlightedCommentId(null), 3000) // 3 秒後移除高亮
                      }}
                    />
                  ) : (
                    <div className="alert alert-warning my-3" role="alert">
                      請先登入會員後才能撰寫評論。
                      <button
                        className="btn btn-sm btn-primary ms-3"
                        onClick={() => {
                          // ✅ 未登入點擊 → 顯示登入 Modal，並記錄課程 ID。
                          localStorage.setItem(
                            'redirectAfterLogin',
                            window.location.href
                          )
                          localStorage.setItem('pendingScrollToComment', id)
                          toast.info('請先登入會員')
                          setShowLoginModal(true)
                        }}
                      >
                        前往登入
                      </button>
                    </div>
                  )}
                </div>
                <div className="row row-cols-1 row-cols-md-2 g-4 y-2 my-3">
                  {reviewCard
                    .filter((v) =>
                      selectedStar ? Math.round(v.star) === selectedStar : true
                    )
                    .slice(0, 4)
                    .map((v) => (
                      <CommentsCard
                        key={v.comment_id}
                        member_name={v.member_name}
                        star={v.star}
                        created={v.created}
                        content={v.content}
                        ava_url={v.ava_url}
                        comment_id={v.comment_id}
                        member_id={v.member_id}
                        likeData={
                          likesMap[v.comment_id] || { liked: false, count: 0 }
                        }
                        onToggleLike={toggleLike}
                        onOpenModal={() => setIsModalOpen(true)}
                        onEdit={(id) => {
                          handleEditComment(id) // ✅ 這行才會把該留言設定為可編輯並打開 Modal
                        }}
                        onDelete={handleDeleteComment}
                        highlighted={highlightedCommentId === v.comment_id} // ✅ 傳入是否高亮
                      />
                    ))}
                </div>

                <div className="">
                  <button
                    onClick={openModal}
                    className="btn btn-sm more-comment open-review-modal"
                  >
                    查看所有評價 <i className="bx bx-chevron-right" />
                  </button>
                  {/* 背景遮罩 */}
                  <div id="modalBackdrop" className="modal-backdrop" />
                </div>
                {/* Modal 彈跳視窗 */}
                <ReviewModal
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  reviewCard={sortedReviews}
                  likesMap={likesMap}
                  toggleLike={toggleLike}
                  onAfterDelete={onAfterDelete}
                  sortOption={sortOption}
                  setSortOption={setSortOption}
                  onEdit={(comment) => {
                    setEditingComment(comment)
                    setIsEditModalOpen(true)
                  }}
                  onUpdate={handleCommentUpdate}
                />
              </div>
              <div className="col-lg-3 d-none d-lg-block">
                <div className="px-0 scroll-card">
                  {/* scroll-card */}
                  <div className="card card-style">
                    <div className="card-body scroll-card-text">
                      <div className="row d-flex justify-content-between align-items-center my-3 mx-0">
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
                          className="btn btn-primary w-100 text-nowrap"
                          onClick={handleBuyNow}
                        >
                          {' '}
                          立即購買{' '}
                        </button>
                      </div>
                      <div className="d-flex justify-content-between align-items-end my-4 ">
                        <button
                          type="button"
                          className="btn scroll-card-btn btn-lg px-xxl-5 px-lg-4 py-2"
                          onClick={handleAddToCart}
                        >
                          <i className="bi bi-handbag text-center" />
                        </button>
                        {/* ✅ 收藏按鈕要加 onClick */}
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
                          <li className="text-start py-2">
                            <i className="bx bx-video scroll-card-icon me-1" />{' '}
                            {v.video_length}
                          </li>
                          <li className="text-start py-2">
                            <i className="bx bx-file-blank scroll-card-icon me-1" />{' '}
                            4 個可下載的資源
                          </li>
                          <li className="text-start py-2">
                            <i className="bx bxs-devices scroll-card-icon me-1" />
                            可透過行動裝置與電視存取
                          </li>
                          <li className="text-start py-2">
                            <i className="bx bx-infinite scroll-card-icon me-1" />
                            完整終身存取權
                          </li>
                          <li className="text-start py-2">
                            <i className="bx bx-trophy scroll-card-icon me-1" />
                            可透過行動裝置與電視存取
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      {/* price-sticky-bar */}
      {data.length > 0 &&
        data.map((v) => (
          <React.Fragment key={`price-sticky-bar-${v.course_id}`}>
            <section>
              <div className="price-sticky-bar sticky-bar-style d-lg-none w-100">
                <div className="d-flex justify-content-between align-items-center px-3">
                  <div className="row my-1 mx-0">
                    <div className="col d-flex flex-column justify-content-center align-items-center text-center">
                      <p className="mb-1 text-decoration-line-through text-muted text-nowrap scroll-card-text">
                        NT$ {Number(v.price).toLocaleString()}
                      </p>
                      <p className="scroll-card-discount fs-2 mb-0 text-nowrap">
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
                    className="btn btn-primary flex-grow-1 mx-2 text-nowrap"
                    onClick={handleBuyNow}
                  >
                    立即購買
                  </button>
                </div>
              </div>
            </section>
          </React.Fragment>
        ))}

      {/*下面 載入footer.html */}
      <section className="box-6 container">
        <hr />
        <div className="px-0 my-5">
          <div className="d-flex ms-2">
            <div className="title-mark me-2" />
            <h3>相關課程推薦</h3>
          </div>
        </div>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-lg-4 g-4 p-0 m-0 my-4">
          {courseCard
            .filter((v) => recommendedCourseIds.includes(v.id))
            .map((v) => (
              <CourseCard
                key={v.id}
                id={v.id}
                picture={COURSE_BANNER_URL + `${v.picture}`}
                tag={v.tag}
                title={v.title}
                teacher={v.teacher}
                student={v.student}
                price={v.price}
                discount={v.discount}
                avg_star={v.avg_star}
                comment_count={v.comment_count}
              />
            ))}
        </div>
      </section>
      {/* 留言編輯 Modal */}
      <EditReviewModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        comment={editingComment}
        onUpdate={handleCommentUpdate}
      />
      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        // handleBuyNow={handleBuyNow}
      />
    </>
  )
}
