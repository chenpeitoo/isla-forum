import Link from 'next/link'

export default function CouponHeader({ type = ' ', hasMemberCoupon = false }) {
  const titleMap = {
    product: '優惠券專區 - 商品',
    course: '優惠券專區 - 課程',
    member: '我的優惠券',
  }

  const isMember = type === 'member'

  return (
    <>
      {/* 電腦版標題 */}
      <div className="d-none d-md-flex align-items-center ps-3">
        <h2 className="me-3 mb-0">{titleMap[type]}</h2>
        {isMember && !hasMemberCoupon && (
          <Link
            href="/coupon/create"
            className="personal-coupon-tab text-decoration-none"
          >
            🎁 專屬優惠券
          </Link>
        )}
      </div>

      {/* 手機版標題：只在 type === 'member' 時顯示 */}
      {isMember && (
        <div className="d-flex d-md-none justify-content-center">
          <h2>{titleMap[type]}</h2>
        </div>
      )}
    </>
  )
}
