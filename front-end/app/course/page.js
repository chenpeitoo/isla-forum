'use client'

import { useState, useEffect, useRef } from 'react' // React hooks 用於狀態與副作用管理
import CourseCard from '../course/_components/course-card/course-card' // 課程卡片元件
import ExperienceCard from '../course/_components/experience-card/experience-card' // 體驗卡片元件
import TeacherCard from '../course/_components/teacher-card/teacher-card' // 講師卡片元件
import CourseBanner from '../course/_components/course-banner/course-banner' // 頁面頂部 Banner 區塊
import MoreCoursesToggle from './_components/more-courses-toggle/more-courses-toggle' // 更多課程展開切換按鈕
import { courseUrl } from '../../_route/courseUrl' // API 路由常數
import { COURSE_BANNER_URL } from '@/_route/img-url'
import { TEACHER_URL } from '@/_route/img-url'
import '../course/_components/course.css' // 課程區塊樣式
import { MdSearch } from 'react-icons/md' // 搜尋 icon
import MobileFilterBar from '../course/_components/mobile-filter-bar/mobile-filter-bar' // 手機版篩選欄元件（目前未使用）
import IslaSwitch from '../_components/form/switch/form-switch'
import Breadcrumb from '../course/_components/breadcrumb/breadcrumb'
import LoadingLottie from '../_components/loading/lottie-loading'
import LoadingErrorLottie from '../_components/loading-error/lottie-error'

export default function CoursePage() {
  // ====== 狀態定義 ======
  const [courseCard, setCourseCard] = useState([]) // 課程資料
  const [experienceCard, setExperienceCard] = useState([]) // 體驗資料
  const [teachers, setTeachers] = useState([]) // 講師資料
  const [searchTerm, setSearchTerm] = useState('') // 搜尋關鍵字
  const [sortOption, setSortOption] = useState('1') // 排序選項 (1:熱門 2:評價 3:時間)
  const [selectedCategory, setSelectedCategory] = useState(null) // 被選取的分類
  const [showFilter, setShowFilter] = useState(false) // 手機版篩選列展開狀態
  const [showAllCourses, setShowAllCourses] = useState(false) // 是否展開所有課程
  const [showExperienceOnly, setShowExperienceOnly] = useState(false) // 是否僅顯示體驗課程
  const lastScrollYRef = useRef(0) // 展開前 scroll 位置

  // ====== 分類選單固定資料 ======
  const fixedCategories = [
    { id: 1, name: '韓式彩妝' },
    { id: 2, name: '專業彩妝' },
    { id: 3, name: '日常彩妝' },
    { id: 4, name: '其他課程' },
  ]
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [windowWidth, setWindowWidth] = useState(1024)
  // ====== 取得課程、體驗與講師資料 ======
  useEffect(() => {
    async function getCourse() {
      try {
        const res = await fetch(courseUrl + 'course')
        const json = await res.json()
        setCourseCard(json.data || [])

        const resexp = await fetch(courseUrl + 'experience')
        const jsonexp = await resexp.json()
        setExperienceCard(jsonexp.data || [])

        const resteacher = await fetch(courseUrl + 'teacher-card')
        const jsonteacher = await resteacher.json()
        setTeachers(jsonteacher.data || [])

        setLoading(false) // ✅ 所有資料都抓完後再關閉 loading
      } catch (error) {
        console.error('載入資料失敗', error)
        setLoading(false)
        setError(true)
      }
    }

    getCourse()
  }, [])
  useEffect(() => {
    // 初始化設定寬度
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth)
    }

    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // ====== 處理展開/收合所有課程功能 ======
  const handleToggleCourses = () => {
    setShowAllCourses((prev) => {
      const newState = !prev
      if (!prev) {
        lastScrollYRef.current = window.scrollY // 記錄目前 scroll 位置
      } else {
        setTimeout(() => {
          window.scrollTo({ top: lastScrollYRef.current, behavior: 'smooth' }) // 回到展開前位置
        }, 100)
      }
      return newState
    })
  }

  // ====== 過濾掉下架課程/體驗 ======
  const filteredCourses = courseCard.filter(
    (v) => v.status !== 0 && v.status !== '0'
  )
  const filteredExperiences = experienceCard.filter(
    (v) => v.status !== 0 && v.status !== '0'
  )

  // ====== 排序邏輯（熱門、評價、時間） ======
  const sortItems = (items) => {
    switch (sortOption) {
      case '1':
        return [...items].sort((a, b) => (b.student || 0) - (a.student || 0)) // 學生人數多優先
      case '2':
        return [...items].sort((a, b) => (b.avg_star || 0) - (a.avg_star || 0)) // 評價高優先
      case '3':
        return [...items].sort(
          (a, b) => new Date(b.created) - new Date(a.created) // 最新時間優先
        )
      default:
        return items
    }
  }

  // ====== 回傳排序後的課程與體驗清單 ======
  const getSortedItems = () => {
    let courses = filteredCourses
    let experiences = filteredExperiences

    // 依據分類過濾
    if (selectedCategory) {
      courses = courses.filter(
        (v) => Number(v.categories_id) === Number(selectedCategory)
      )
      experiences = experiences.filter(
        (v) => Number(v.categories_id) === Number(selectedCategory)
      )
    }

    // 若啟用「僅顯示體驗」，只回傳 tag 為 2 的體驗
    if (showExperienceOnly) {
      experiences = experiences.filter((v) => v.tag === 2 || v.tag === '2')
      return sortItems(experiences)
    }

    // 回傳混合的課程與體驗資料，並排序
    return sortItems([...courses, ...experiences])
  }

  // ====== 根據裝置寬度決定顯示數量 ======
  const getResponsiveItems = () => {
    const sortedItems = getSortedItems()

    if (showAllCourses) return sortedItems

    const maxItems = windowWidth < 768 ? 4 : 12
    return sortedItems.slice(0, maxItems)
  }

  // ====== 限制最多顯示 12 筆，除非點選展開 ======
  const visibleItems = showAllCourses
    ? getSortedItems()
    : getSortedItems().slice(0, 12)

  // ====== 課程/體驗搜尋結果（符合標題或講師名） ======
  const searchResults = [...filteredCourses, ...filteredExperiences].filter(
    (v) => {
      const titleMatch = v.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
      const teacherMatch = v.teacher_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
      return titleMatch || teacherMatch
    }
  )

  // ====== 講師搜尋結果 ======
  const teacherResults = teachers.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
      <CourseBanner />
      <section className="box2 container">
        <div className="row d-lg-flex d-none">
          <Breadcrumb current="所有課程" className="mt-5" />
        </div>

        <div className="row mt-3 d-flex justify-content-between d-lg-flex d-none no-wrap">
          <div className="row col-xxl-6 col-xl-7 col-lg-8 p-0 m-0">
            <ul
              className="nav nav-pills d-flex col-12 p-0 m-0 justify-content-between"
              id="pills-tab"
              role="tablist"
            >
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link search-btn ${selectedCategory === null ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(null)}
                >
                  所有課程
                </button>
              </li>
              {fixedCategories.map((cat) => (
                <li className="nav-item" role="presentation" key={cat.id}>
                  <button
                    className={`nav-link search-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
              <li className="nav-item" role="presentation">
                <div className="d-flex justify-content-center">
                  <IslaSwitch
                    checked={!!showExperienceOnly}
                    onChange={() => setShowExperienceOnly((prev) => !prev)}
                    size="medium"
                  />
                  <label className="ps-2 search-btntext">彩妝體驗</label>
                </div>
              </li>
            </ul>
          </div>

          <div className="row col-xl-4 col-lg-3 d-flex justify-content-between align-content-center p-0 m-0">
            <div className="col-xl-8 col-lg-7 p-0 m-0 position-relative">
              <input
                type="text"
                className="form-control ps-5"
                placeholder="搜尋課程、講師"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MdSearch className="position-absolute search-icon" />
            </div>
            <div className="col-xl-3 col-lg-4 p-0 m-0">
              <select
                className="form-select no-border"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="1">最熱門</option>
                <option value="2">依評價</option>
                <option value="3">依時間</option>
              </select>
            </div>
          </div>
        </div>
      </section>
      {/* search-sticky-bar */}
      <section>
        <div className="search-sticky-bar sticky-bar-style d-lg-none w-100">
          {/* 篩選按鈕 */}
          <div className="d-flex justify-content-between align-items-center px-3">
            <button
              className="text-center w-100 py-2 search-sticky-filter border-0 bg-transparent d-flex justify-content-center align-items-center gap-1"
              type="button"
              onClick={() => setShowFilter(!showFilter)} // ✅ 正確切換 filter 展開狀態
            >
              篩選{' '}
              <i className={`bx bx-chevron-${showFilter ? 'up' : 'down'}`} />
            </button>
          </div>
          {/* 搜尋欄 */}
          <div className="d-flex justify-content-between align-items-center px-3 position-relative">
            <div className="py-3 text-center w-100">
              <input
                type="text"
                className="form-control ps-5"
                placeholder="想學新技巧？搜尋課程、老師、彩妝體驗通通有！"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="bx bx-search search-icon-m position-absolute ps-2" />
            </div>
          </div>
          {/* 篩選內容（預設隱藏） */}
          <div
            className={`px-3 animated-collapse ${showFilter ? 'open' : ''}`}
            id="filterCollapse"
          >
            <div className="py-3">
              <p className="mb-1 fw-bold">排序-由高到低</p>
              <div className="row col-xxl-6 col-xl-7 col-lg-8 p-0 m-0">
                <ul
                  className="nav nav-pills d-flex col-12 p-0 m-0 justify-content-start"
                  id="pills-tab"
                  role="tablist"
                >
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link search-btn ${sortOption === '1' ? 'active' : ''}`}
                      type="button"
                      onClick={() => setSortOption('1')}
                    >
                      最熱門
                    </button>
                  </li>

                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link search-btn ${sortOption === '2' ? 'active' : ''}`}
                      type="button"
                      onClick={() => setSortOption('2')}
                    >
                      依評價
                    </button>
                  </li>

                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link search-btn ${sortOption === '3' ? 'active' : ''}`}
                      type="button"
                      onClick={() => setSortOption('3')}
                    >
                      依時間
                    </button>
                  </li>
                </ul>
              </div>
              <hr />
              <p className="mb-1 fw-bold">狀態</p>

              <div className=" py-2 d-flex align-items-center">
                <IslaSwitch
                  checked={!!showExperienceOnly}
                  onChange={() => setShowExperienceOnly((prev) => !prev)}
                  size="medium"
                />
                <label className="ps-2 search-btntext">彩妝體驗</label>
              </div>
              <div className="mb-1 fw-bold">類別</div>
              <section className="d-lg-none my-1">
                <div className="d-flex overflow-auto gap-2">
                  <button
                    className={`btn p-1 nav-link search-btn ${selectedCategory === null ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(null)}
                  >
                    所有課程
                  </button>
                  {fixedCategories.map((cat) => (
                    <button
                      key={cat.id}
                      className={`btn p-1 nav-link search-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
      <section className="box3 container p-0" ref={lastScrollYRef}>
        <div className="tab-content" id="pills-tabContent">
          <div
            className="tab-pane fade show active"
            id="pills-home"
            role="tabpanel"
          >
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-lg-4 g-4 p-0 m-0 mt-4">
              {searchTerm ? (
                <>
                  {searchResults.map((v) =>
                    v.tag === 1 || v.tag === '1' ? (
                      <CourseCard
                        key={`course-${v.id}-${v.title}`}
                        id={v.id}
                        picture={COURSE_BANNER_URL + v.picture}
                        tag={v.tag}
                        title={v.title}
                        teacher_name={v.teacher_name}
                        teacher={v.teacher}
                        student={v.student}
                        price={v.price}
                        discount={v.discount}
                        avg_star={v.avg_star}
                        comment_count={v.comment_count}
                      />
                    ) : (
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
                    )
                  )}
                  {teacherResults.map((t) => (
                    <div
                      className="col-12 col-md-4 mb-4"
                      key={`teacher-${t.id}`}
                    >
                      <TeacherCard
                        id={t.id}
                        name={t.name}
                        image={TEACHER_URL + t.ava_url}
                        about={t.about}
                      />
                    </div>
                  ))}
                </>
              ) : (
                getResponsiveItems().map((v) =>
                  v.tag === 1 || v.tag === '1' ? (
                    <CourseCard
                      key={`course-${v.id}-${v.title}`}
                      id={v.id}
                      picture={COURSE_BANNER_URL + v.picture}
                      tag={v.tag}
                      title={v.title}
                      teacher_name={v.teacher_name}
                      teacher={v.teacher}
                      student={v.student}
                      price={v.price}
                      discount={v.discount}
                      avg_star={v.avg_star}
                      comment_count={v.comment_count}
                    />
                  ) : (
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
                  )
                )
              )}
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center align-items-center mb-5 mt-3">
          <MoreCoursesToggle
            isExpanded={showAllCourses}
            onToggle={handleToggleCourses}
          />
        </div>
      </section>
      <section className="box4">
        <div className="container py-5 px-0">
          <div className="d-flex ms-2">
            <div className="title-mark me-2" />
            <h3>熱門講師</h3>
          </div>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-lg-4 g-4 p-0 m-0 mt-4">
            {teachers.slice(0, 4).map((t) => (
              <div className="col-12 col-md-4 mb-4" key={t.id}>
                <TeacherCard
                  id={t.id}
                  name={t.name}
                  image={TEACHER_URL + t.ava_url}
                  about={t.about}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
