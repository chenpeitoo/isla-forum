// 課程優惠券頁面
'use client'
import useSWR from 'swr'
import '../_components/coupon.css'
import AsideCourse from '../_components/aside-course'
import PcNav from '../_components/pc-nav'
import CouponList from '../_components/coupon-list'
import LoadMoreButton from '../_components/more-button'
import DataStatus from '../_components/data-status'
import CouponHeader from '../_components/coupon-header'
import LoginModal from '../_components/login-modal'
import useCouponFilter from '../../../hook/coupon-filter'
import Componentstab from '../_components/tab/tab'
import MobileCouponFilter from '../_components/filter/mobile-product-filter'
import MobileCourseFilter from '../_components/filter/mobile-course-filter'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hook/use-auth'

// SWR 用於資料請求
const fetcher = (...args) => fetch(...args).then((res) => res.json())

// 優惠券樣式對應
const typeIdToStyle = {
  1: 'button-orange',
  2: 'button-purple',
  3: 'button-blue',
}
const getCouponStyle = (typeId) => typeIdToStyle[typeId] || 'button-all'

export default function CouponPage() {
  // 使用者登入資料與 API URL
  const { user } = useAuth()
  const url = user
    ? `http://localhost:3005/api/coupon/products?user_id=${user.id}`
    : null
  const { data, mutate, error } = useSWR(url, fetcher)

  // 手機版 tab 狀態（1 = 商品，2 = 課程）
  const [tab, setTab] = useState(2)
  const handleRefresh = () => mutate()

  // 是否為手機裝置
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileFilter, setShowMobileFilter] = useState(false)

  // 偵測螢幕尺寸以切換 tab（桌機與手機預設為課程 tab）
  useEffect(() => {
    const mobile = window.innerWidth < 768
    setIsMobile(mobile)
    setTab(2) // 強制設定為課程 tab
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setTab(2) // 再次強制切到課程 tab，防止進入時為商品
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 篩選狀態管理 hook
  const { currentType, setCurrentType } = useCouponFilter(' ')
  const {
    showClaimed,
    setShowClaimed,
    currentBrand,
    setCurrentBrand,
    productCategory,
    setProductCategory,
    courseCategory,
    setCourseCategory,
  } = useCouponFilter()

  // 品牌對照表
  const brandMap = {
    1: 'Unleashia',
    3: 'Cosnori',
    4: 'Muzigae Mansion',
    5: 'Kaja',
    6: 'rom&nd',
    2: "A'Pieu",
  }

  // 優惠券類型篩選項目
  const couponTypes = [
    { label: '全部', value: ' ' },
    { label: '滿額券', value: 1 },
    { label: '折扣券', value: 2 },
  ]

  // 每種分類對應載入數量
  const [couponCountMap, setCouponCountMap] = useState({
    ' ': 10,
    1: 10,
    2: 10,
    3: 10,
  })
  const currentCount = couponCountMap[currentType] || 10

  // 載入狀態與錯誤處理
  const isLoading = !data
  const isError = error || data?.status === 'false'

  // 從 API 資料取出優惠券陣列
  const coupons = Array.isArray(data?.data?.coupons) ? data.data.coupons : []
  const localCoupons = coupons

  // 篩選與排序
  const filteredCoupons = coupons
    .filter((coupon) => {
      const typeMatch = currentType === ' ' || coupon.type_id === currentType
      const claimedMatch = showClaimed ? coupon.claimed : true
      const categoryMatch =
        tab === 1
          ? !productCategory || coupon.category_name === productCategory
          : !courseCategory || coupon.course_category_name === courseCategory
      const brandMatch =
        tab === 1
          ? !currentBrand ||
            coupon.brand_id ===
              Number(
                Object.keys(brandMap).find(
                  (key) => brandMap[key] === currentBrand
                )
              )
          : true
      return typeMatch && claimedMatch && categoryMatch && brandMatch
    })
    .sort((a, b) => {
      const stylePriority = {
        'button-all': '',
        'button-orange': 1,
        'button-purple': 2,
        'button-blue': 3,
      }
      const aStyle = getCouponStyle(a.type_id)
      const bStyle = getCouponStyle(b.type_id)
      return (stylePriority[aStyle] ?? 99) - (stylePriority[bStyle] ?? 99)
    })

  // 過濾出符合 tab 的優惠券資料
  const tabFilteredCoupons = filteredCoupons.filter((coupon) => {
    const area = parseInt(coupon.area)
    return area === 0 || area === tab
  })

  // 顯示優惠券（含分頁數）
  const displayCoupon = tabFilteredCoupons.slice(0, currentCount)
  const moreBtn = currentCount < tabFilteredCoupons.length
  const isEmpty = !isLoading && !isError && tabFilteredCoupons.length === 0
  const emptyMsg = showClaimed ? '尚未有已領取的優惠券' : '尚未有優惠券'

  // 載入更多優惠券
  const handleLoadMore = () => {
    setCouponCountMap((prev) => ({
      ...prev,
      [currentType]: (prev[currentType] || 10) + 10,
    }))
  }

  // 登入提示 modal 狀態
  const [showLoginModal, setShowLoginModal] = useState(false)

  // 切換手機 tab（商品/課程）
  const handleTabChange = (newTab) => {
    setTab(newTab)
    setCouponCountMap((prev) => ({
      ...prev,
      [currentType]: 10,
    }))
  }

  return (
    <main className="px-md-5 px-3 pb-5 container">
      <div className="row mt-0 pt-sm-5 g-sm-5">
        {/* 左側課程分類篩選區塊 */}
        <AsideCourse
          courseCategory={courseCategory}
          setCourseCategory={setCourseCategory}
        />

        <div className="col-lg-9 col-md-8 col-12 mt-0">
          <CouponHeader type="course" />

          {/* 手機版：上下切換 tab */}
          {isMobile && (
            <Componentstab
              cates={['商品', '課程']}
              currentTab={tab} // ✅ 傳入目前的 tab 狀態，解決預設錯誤高亮問題
              handleTabChange={handleTabChange}
            />
          )}

          {/* 手機版：切換商品或課程篩選元件 */}
          {isMobile &&
            (tab === 1 ? (
              <MobileCouponFilter
                isPanelOpen={showMobileFilter}
                onTogglePanel={() => setShowMobileFilter((prev) => !prev)}
                currentBrand={currentBrand}
                setCurrentBrand={setCurrentBrand}
                productCategory={productCategory}
                setProductCategory={setProductCategory}
                brandOptions={Object.values(brandMap)}
                categoryOptions={Array.from(
                  new Set(
                    localCoupons
                      .filter((c) => parseInt(c.area) === 1)
                      .map((c) => c.category_name)
                      .filter(Boolean)
                  )
                )}
              />
            ) : (
              <MobileCourseFilter
                isPanelOpen={showMobileFilter}
                onTogglePanel={() => setShowMobileFilter((prev) => !prev)}
                currentCategory={courseCategory}
                setCurrentCategory={setCourseCategory}
                categoryOptions={Array.from(
                  new Set(
                    localCoupons
                      .filter((c) => parseInt(c.area) === 2)
                      .map((c) => c.course_category_name)
                      .filter(Boolean)
                  )
                )}
              />
            ))}

          {/* 桌機版：分類與已領取切換 */}
          <PcNav
            options={couponTypes}
            currentValue={currentType}
            onChange={setCurrentType}
            showSwitch={true}
            isChecked={showClaimed}
            onToggleSwitch={() => setShowClaimed((prev) => !prev)}
          />

          {/* 狀態提示（空清單/錯誤/載入） */}
          <DataStatus
            isLoading={isLoading}
            isError={isError}
            isEmpty={isEmpty}
            message={emptyMsg}
            errorMessage="伺服器忙線中，請稍後再試"
          />

          {/* 優惠券列表與載入更多按鈕 */}
          {!isLoading && !isError && (
            <>
              <CouponList
                coupons={displayCoupon}
                getCouponStyle={getCouponStyle}
                isLogin={() => setShowLoginModal(true)}
                handleRefresh={handleRefresh}
              />
              <LoadMoreButton visible={moreBtn} onClick={handleLoadMore} />
            </>
          )}
        </div>
      </div>

      {/* 登入提示 Modal */}
      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </main>
  )
}
