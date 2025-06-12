'use client'
import useSWR from 'swr'
import dayjs from 'dayjs'
import '../_components/coupon.css'
import AsideProduct from '../_components/aside-product'
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

// SWR fetcher：用於抓後端資料
const fetcher = (...args) => fetch(...args).then((res) => res.json())

// type_id -> 樣式對應
const typeIdToStyle = {
  1: 'button-orange',
  2: 'button-purple',
  3: 'button-blue',
}
const getCouponStyle = (typeId) => typeIdToStyle[typeId] || 'button-all'

export default function CouponPage() {
  //  使用者資料 & 取得優惠券 API 路徑
  const { user } = useAuth()
  const url = user
    ? `http://localhost:3005/api/coupon/products?user_id=${user.id}`
    : null

  //  取得優惠券資料
  const { data, error } = useSWR(url, fetcher)

  // 預防 TDZ 錯誤：先宣告 coupons
  const coupons = Array.isArray(data?.data?.coupons) ? data.data.coupons : []

  //  localCoupons 控制畫面資料（避免領取後重抓整包資料）
  const [localCoupons, setLocalCoupons] = useState([])

  // 初始化 localCoupons（當遠端資料更新時）
  useEffect(() => {
    if (coupons.length) {
      setLocalCoupons(coupons)
    }
  }, [coupons])

  // 單張更新優惠券狀態（避免重新 fetch）
  const handleClaimSuccess = (couponId) => {
    setLocalCoupons((prev) =>
      prev.map((c) =>
        c.id === couponId
          ? {
              ...c,
              claimed: new Date().toISOString(),
              state_id: 1,
            }
          : c
      )
    )
  }

  // 手機版 tab 切換（1 = 商品、2 = 課程）
  const [tab, setTab] = useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileFilter, setShowMobileFilter] = useState(false)

  // 監聽畫面大小以切換手機/桌機介面
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) setTab(1)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  //  篩選相關 hook（優惠券類型、品牌、分類等）
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

  //  品牌對應名稱轉換
  const brandMap = {
    1: 'Unleashia',
    3: 'Cosnori',
    4: 'Muzigae Mansion',
    5: 'Kaja',
    6: 'rom&nd',
    2: "A'Pieu",
  }
  const nameToId = Object.fromEntries(
    Object.entries(brandMap).map(([id, name]) => [name, Number(id)])
  )

  //  分類選單
  const couponTypes = [
    { label: '全部', value: ' ' },
    { label: '滿額券', value: 1 },
    { label: '折扣券', value: 2 },
    { label: '免運券', value: 3 },
  ]

  //  每個類型最多顯示幾張（搭配載入更多）
  const [couponCountMap, setCouponCountMap] = useState({
    ' ': 10,
    1: 10,
    2: 10,
    3: 10,
  })
  const currentCount = couponCountMap[currentType] || 10

  //  狀態標記（載入中 / 錯誤）
  const isLoading = !data
  const isError = error || data?.status === 'false'

  //  篩選 + 排序
  const now = dayjs()
  const shouldExcludeExpired = !showClaimed

  const filteredCoupons = localCoupons
    .filter((coupon) => {
      const typeMatch = currentType === ' ' || coupon.type_id === currentType
      const claimedMatch = showClaimed ? coupon.claimed : true
      const brandMatch =
        !currentBrand || coupon.brand_id === nameToId[currentBrand]
      const categoryMatch =
        tab === 1
          ? !productCategory || coupon.category_name === productCategory
          : !courseCategory || coupon.course_category_name === courseCategory
      const validTo = dayjs(coupon.valid_to)
      const isExpired = validTo.isBefore(now.startOf('day'))

      return (
        typeMatch &&
        claimedMatch &&
        brandMatch &&
        categoryMatch &&
        (shouldExcludeExpired ? !isExpired : true)
      )
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

  //  依 tab 過濾商品 or 課程
  const tabFilteredCoupons = filteredCoupons.filter((coupon) => {
    const area = parseInt(coupon.area)
    return area === 0 || area === tab
  })

  //  顯示區塊
  const displayCoupon = tabFilteredCoupons.slice(0, currentCount)
  const moreBtn = currentCount < tabFilteredCoupons.length
  const isEmpty = !isLoading && !isError && tabFilteredCoupons.length === 0
  const emptyMsg = showClaimed ? '尚未有已領取的優惠券' : '尚未有優惠券'

  //  點擊載入更多
  const handleLoadMore = () => {
    setCouponCountMap((prev) => ({
      ...prev,
      [currentType]: (prev[currentType] || 10) + 10,
    }))
  }

  //  未登入提醒 modal
  const [showLoginModal, setShowLoginModal] = useState(false)

  //  tab 切換
  const handleTabChange = (newTab) => {
    setTab(newTab)
    setCouponCountMap((prev) => ({
      ...prev,
      [currentType]: 10,
    }))
  }

  return (
    <main className="px-md-5 px-3 pb-5 container min-vh-100 ">
      <div className="row mt-0 pt-sm-5 g-sm-5">
        {/* 左側篩選區 */}
        <AsideProduct
          currentBrand={currentBrand}
          setCurrentBrand={setCurrentBrand}
          productCategory={productCategory}
          setProductCategory={setProductCategory}
        />

        {/* 主內容區 */}
        <div className="col-lg-9 col-md-8 col-12 mt-0">
          <CouponHeader type="product" />

          {/* 手機版：上下切換 tab */}
          {isMobile && (
            <Componentstab
              cates={['商品', '課程']}
              handleTabChange={handleTabChange}
            />
          )}
          {/* 手機版篩選 */}
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
          {/* 篩選分類選單 + 已領取開關 */}
          <PcNav
            options={couponTypes}
            currentValue={currentType}
            onChange={setCurrentType}
            showSwitch={true}
            isChecked={showClaimed}
            onToggleSwitch={() => setShowClaimed((prev) => !prev)}
          />

          {/* 狀態顯示 */}
          <DataStatus
            isLoading={isLoading}
            isError={isError}
            isEmpty={isEmpty}
            message={emptyMsg}
            errorMessage="伺服器忙線中，請稍後再試"
          />

          {/* 優惠券清單 + 載入更多按鈕 */}
          {!isLoading && !isError && (
            <>
              <CouponList
                coupons={displayCoupon}
                getCouponStyle={getCouponStyle}
                isLogin={() => setShowLoginModal(true)}
                handleClaimSuccess={handleClaimSuccess}
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
