'use client'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import dayjs from 'dayjs'
import { useState } from 'react'
import EditCouponForm from './edit-product-coupon'

export default function CouponTable({
  coupons,
  brands = [],
  categories = [],
  onEdit = () => {},
  onDelete = () => {},
}) {
  const [deleteId, setDeleteId] = useState(null)
  const [editCoupon, setEditCoupon] = useState(null)
  // 商品優惠券顯示
  const showCategoryColumn = coupons.some((c) => c.area === 1)
  // 優惠券種類區分(加上顏色)
  const getTypeStyle = (typeName) => {
    switch (typeName) {
      case '折扣券':
        return 'bg-purple-100 text-purple-800'
      case '滿額券':
        return 'bg-orange-100 text-orange-800'
      case '免運券':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  // 剩幾天過期
  const getDaysLeft = (validTo) => {
    const diff = dayjs(validTo).diff(dayjs(), 'day')
    return diff >= 0 ? `剩 ${diff} 天` : '已過期'
  }
  // 使用對象
  const getTargetScope = (coupon) => {
    const { brand_name, course_category_name, area } = coupon
    if (!brand_name && !course_category_name && area === 0) return '全站通用'
    if (brand_name) return brand_name
    if (course_category_name) return course_category_name
    return '所有課程'
  }

  const handleEditChange = (field, value) => {
    setEditCoupon((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <>
      <Table>
        <TableCaption>優惠券列表（共 {coupons.length} 筆）</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>名稱</TableHead>
            <TableHead>使用對象</TableHead>
            {showCategoryColumn && <TableHead>種類</TableHead>}
            <TableHead>類型</TableHead>
            <TableHead>說明</TableHead>
            <TableHead>到期日</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.map((c) => (
            <TableRow key={c.id}>
              <TableCell>{c.id}</TableCell>
              <TableCell>{c.title}</TableCell>
              <TableCell>
                {getTargetScope(c) === '全站通用' ? (
                  <Badge className="bg-red-100 text-red-800">全站通用</Badge>
                ) : (
                  getTargetScope(c)
                )}
              </TableCell>
              {showCategoryColumn && (
                <TableCell>{c.category_name || '無限制'}</TableCell>
              )}
              <TableCell>
                <span
                  className={`px-2 py-1 rounded text-sm ${getTypeStyle(c.type_name)}`}
                >
                  {c.type_name}
                </span>
              </TableCell>
              <TableCell>{c.description}</TableCell>
              <TableCell>
                {dayjs(c.valid_to).format('YYYY-MM-DD')} (
                {getDaysLeft(c.valid_to)})
              </TableCell>
              <TableCell className="space-x-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => setEditCoupon(c)}
                >
                  編輯
                </button>
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => setDeleteId(c.id)}
                >
                  刪除
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={showCategoryColumn ? 8 : 7}>
              共 {coupons.length} 筆優惠券
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      {/* 刪除 Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>確認刪除</DialogTitle>
          </DialogHeader>
          <p>你確定要刪除這筆優惠券嗎？此操作無法復原。</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(deleteId)
                setDeleteId(null)
              }}
            >
              確認刪除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 編輯 Dialog */}
      <Dialog open={!!editCoupon} onOpenChange={() => setEditCoupon(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>編輯優惠券</DialogTitle>
          </DialogHeader>

          {editCoupon && (
            <EditCouponForm
              coupon={editCoupon}
              onChange={(field, value) =>
                setEditCoupon((prev) => ({ ...prev, [field]: value }))
              }
              onCancel={() => setEditCoupon(null)}
              onSave={() => {
                onEdit(editCoupon)
                setEditCoupon(null)
              }}
              brands={brands}
              categories={categories}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
