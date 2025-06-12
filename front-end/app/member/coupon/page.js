'use client'
import useSWR from 'swr'
import dayjs from 'dayjs'
import CouponHeader from '@/app/coupon/_components/coupon-header'
import PcNav from '@/app/coupon/_components/pc-nav'
import DataStatus from '@/app/coupon/_components/data-status'
import CouponList from '@/app/coupon/_components/coupon-list'
import LoadMoreButton from '@/app/coupon/_components/more-button'
import '../../coupon/_components/coupon.css'
import useCouponFilter from '../../../hook/coupon-filter'
import { useState } from 'react'
import { useAuth } from '@/hook/use-auth'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

const typeIdToStyle = {
  1: 'button-orange',
  2: 'button-purple',
  3: 'button-blue',
}
const getCouponStyle = (typeId) => typeIdToStyle[typeId] || 'button-all'

export default function CouponPage() {
  const { user } = useAuth()
  const url = user?.id
    ? `http://localhost:3005/api/coupon/products/member?user_id=${user.id}`
    : null
  const { data, error } = useSWR(url, fetcher)
  const coupons = Array.isArray(data?.data?.coupons) ? data.data.coupons : []
  // 進入畫面我先設已領取
  const { currentType, setCurrentType } = useCouponFilter(1)

  const now = dayjs()
  const filteredCoupons = coupons.filter((coupon) => {
    // 轉成dayjs格式
    const validTo = dayjs(coupon.valid_to)
    // 剩幾天到期
    const daysToExpire = validTo.startOf('day').diff(now.startOf('day'), 'day')
    // 過期我先設0-3天內

    const isClaimedState = coupon.state_id === 1 || coupon.state_id === 4
    const isSoonExpired =
      daysToExpire >= 0 && daysToExpire <= 3 && isClaimedState
    const isExpired = validTo.startOf('day').isBefore(now.startOf('day'))

    let time = false
    switch (currentType) {
      case 1: // 已領取
        time = coupon.state_id === 1 && !isExpired
        break
      case 2: // 已使用
        time = coupon.state_id === 2
        break
      case 3: // 已過期
        time = coupon.state_id === 3 || isExpired
        break
      case 4: // 即將過期
        return isSoonExpired
      default: // 預設已領取且未過期
        return coupon.state_id === 1 && !isExpired
    }
    return time
  })
  // 專屬優惠券 排最前面
  const prioritizedCoupons = [...filteredCoupons]
    .sort((a, b) => {
      const aIsMember = a.type_id === 5
      const bIsMember = b.type_id === 5

      if (aIsMember && !bIsMember) return -1
      if (!aIsMember && bIsMember) return 1

      const stylePriority = {
        'button-orange': 1,
        'button-purple': 2,
        'button-blue': 3,
      }

      const aStyle = getCouponStyle(a.type_id)
      const bStyle = getCouponStyle(b.type_id)

      const aPriority = stylePriority[aStyle] ?? 99
      const bPriority = stylePriority[bStyle] ?? 99

      return aPriority - bPriority
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

      const aPriority = stylePriority[aStyle] ?? 99
      const bPriority = stylePriority[bStyle] ?? 99

      return aPriority - bPriority
    })

  const [couponCount, setCouponCount] = useState(10)
  const displayCoupon = prioritizedCoupons.slice(0, couponCount)
  const moreBtn = couponCount < filteredCoupons.length
  const couponStates = [
    { label: '已領取', value: 1 },
    { label: '即將過期', value: 4 },
    { label: '已使用', value: 2 },
    { label: '已過期', value: 3 },
  ]
  // 是否有專屬優惠券
  const hasMemberCoupon = coupons.some((c) => c.type_id === 5)

  return (
    <div className="min-vh-100">
      <CouponHeader type="member" hasMemberCoupon={hasMemberCoupon} />
      <PcNav
        type="member"
        options={couponStates}
        currentValue={currentType}
        onChange={setCurrentType}
        showSwitch={false}
      />
      <DataStatus isLoading={!data} isError={error} />
      {data && !error && (
        <>
          <CouponList coupons={displayCoupon} getCouponStyle={getCouponStyle} />
          <LoadMoreButton
            visible={moreBtn}
            onClick={() => setCouponCount((c) => c + 10)}
          />
        </>
      )}
    </div>
  )
}
