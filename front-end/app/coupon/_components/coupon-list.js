import CouponCard from './coupon-card'
import { useAuth } from '@/hook/use-auth'

export default function CouponList({
  coupons,
  getCouponStyle,
  isLogin,
  handleClaimSuccess = () => {},
}) {
  const { user } = useAuth()

  // console.log('CouponList-user', user)

  return (
    <div className="row row-cols-lg-2 row-cols-1 justify-content-center mt-3 mt-lg-0 g-3">
      {coupons.map((coupon, index) => (
        <div
          key={coupon.id}
          className={`col ${
            coupons.length % 2 === 1 && index === coupons.length - 1
              ? 'me-auto'
              : ''
          }`}
        >
          <CouponCard
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
            isLogin={isLogin}
            state_id={coupon.state_id}
            type_id={coupon.type_id}
            handleClaimSuccess={() => handleClaimSuccess(coupon.id)}
          />
        </div>
      ))}
    </div>
  )
}
