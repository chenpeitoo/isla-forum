'use client'

import useSWR from 'swr'
import Link from 'next/link'
import CouponCard from '@/app/coupon/_components/coupon-card'
import '@/app/coupon/_components/coupon.css'
import { useAuth } from '@/hook/use-auth'
// ==== css ====
import './_style/coupon-section.css'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default function CouponSection() {
  const { user } = useAuth()
  // ==== use coupon api ====
  const url = `http://localhost:3005/api/coupon/products`
  const { data, mutate, error } = useSWR(url, fetcher)
  const handleRefresh = () => {
    mutate()
  }
  // ==== END use coupon api ====
  // ==== 取出所有COUPON_TYPE的第一張，整理成ARRAY ====
  let couponType = [1, 2, 3]
  const coupons =
    data?.data?.coupons.filter((v) => {
      // console.log('========')
      // console.log('couponType', couponType)
      for (let type of couponType) {
        // console.log('type', type)
        // console.log('v.type_id', v.type_id)
        if (parseInt(v.type_id) === parseInt(type)) {
          couponType = couponType.filter((v) => v != type)
          return true
        }
      }
    }) || []
  // ==== END 取出所有COUPON_TYPE的第一張，整理成ARRAY ====
  // ==== coupon style ====
  const typeIdToStyle = {
    1: 'button-orange',
    2: 'button-purple',
    3: 'button-blue',
  }
  const getCouponStyle = (typeId) => typeIdToStyle[typeId] || 'button-all'
  // ==== END coupon style ====
  return (
    <>
      <div className="d-flex flex-column gap-5 coupon-section">
        <div className="container">
          {/* ==== title ==== */}
          <div className="d-flex justify-content-between align-items-center text-white p-3">
            <h2 className="show-more-coupon-title">優惠券專區 COUPON</h2>
            <Link className={'show-more-coupon'} href="/coupon/products">
              查看更多優惠券 &gt;
            </Link>
          </div>
          {/* ==== coupon list ==== */}
          <div className="row row-cols-lg-3 row-cols-md-2 row-cols-1 gy-5 justify-content-center py-3">
            {coupons.map((coupon, i) => {
              return (
                <CouponCard
                  key={i}
                  user_id={user?.id}
                  coupon_id={coupon.id}
                  brand_id={coupon.brand_id}
                  categories={coupon.category_id}
                  course_categories_id={coupon.course_categories_id}
                  title={coupon.title}
                  description={coupon.description}
                  couponstyle={getCouponStyle(coupon.type_id)}
                  valid_to={coupon.valid_to}
                  area={coupon.area}
                  claimed_at={coupon.claimed}
                  state_id={coupon.state_id}
                  type_id={coupon.type_id}
                  handleRefresh={handleRefresh}
                />
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
