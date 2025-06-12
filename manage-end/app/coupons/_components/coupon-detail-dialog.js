'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import dayjs from 'dayjs'

export default function CouponDetailDialog({ coupon, open, onClose }) {
  if (!coupon) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">
            {coupon.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {/* 優惠券類型 */}
            <div className="col-span-2">
              <span className="font-medium">類型：</span>
              <Badge
                className={
                  coupon.type === '折扣券'
                    ? 'bg-purple-100 text-purple-800'
                    : coupon.type === '滿額券'
                      ? 'bg-orange-100 text-orange-800'
                      : coupon.type === '免運券'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                }
              >
                {coupon.type}
              </Badge>
            </div>

            {/* 商品品牌 */}
            {coupon.area === 1 && (
              <>
                <div>
                  <span className="font-medium">品牌：</span>
                  {coupon.brand || '無'}
                </div>
                <div>
                  <span className="font-medium">商品分類：</span>
                  {coupon.category || '無'}
                </div>
              </>
            )}

            {/* 商品種類 */}
            {coupon.area === 1 && (
              <>
                <div>
                  <span className="font-medium">商品分類：</span>
                  {coupon.category || '無'}
                </div>
              </>
            )}

            {/* 課程分類 */}
            {coupon.area === 2 && (
              <div>
                <span className="font-medium">課程分類：</span>
                {coupon.course_category_name || '無'}
              </div>
            )}

            {/* 折扣金額 */}
            <div>
              <span className="font-medium">折扣金額：</span> NT$
              {coupon.amount || 0}
            </div>

            {/* 折扣律 */}
            <div>
              <span className="font-medium">折扣率：</span>{' '}
              {coupon.discount_rate !== null &&
              coupon.discount_rate !== undefined
                ? `${coupon.discount_rate * 100} 折`
                : '0 折'}
            </div>

            {/* 最低金額 */}
            <div>
              <span className="font-medium">最低金額：</span>{' '}
              {coupon.min_amount || 0}
            </div>

            {/* 最少數量 */}
            <div>
              <span className="font-medium">最低數量：</span>{' '}
              {coupon.min_quantity || 0}
            </div>

            {/* 免運 */}
            <div className="col-span-2">
              <span className="font-medium">免運：</span>
              {parseInt(coupon.free) === 1 ? '是' : '否'}
            </div>

            {/* 描述 */}
            <div className="col-span-2">
              <span className="font-medium">說明：</span>
              <p className="mt-1 text-gray-600 whitespace-pre-wrap">
                {coupon.description || '無'}
              </p>
            </div>

            {/* 有效期限 */}
            <div className="col-span-2">
              <span className="font-medium">有效期限：</span>{' '}
              <span className="text-red-500">
                {dayjs(coupon.valid_to).format('YYYY-MM-DD')}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
