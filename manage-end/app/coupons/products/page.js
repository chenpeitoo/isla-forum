'use client'

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Plus,
  Edit2,
  Trash2,
  MoreHorizontal,
  Eye,
  CheckCircle,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import CouponDetailDialog from '../_components/coupon-detail-dialog'
import useCouponOption from '@/hook/use-coupon-options'
import EditProductCoupon from '../_components/edit-product-coupon'

export default function CouponListPage() {
  const [coupons, setCoupons] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [editCoupon, setEditCoupon] = useState(null) // 編輯優惠券
  const { brands, categories, types } = useCouponOption() // 獲取品牌跟種類跟優惠券類型
  const [originalCoupon, setOriginalCoupon] = useState(null)
  const [refresh, setRefresh] = useState(false) // 重新抓取資料
  const [selectedCouponForDialog, setSelectedCouponForDialog] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('jwtToken')
    fetch('http://localhost:3005/api/coupon/admin', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.data
          .filter((coupon) => coupon.area === 1 || coupon.area === 0)
          .map((c) => ({
            id: c.id,
            title: c.title,
            description: c.description,
            brand_id: c.brand_id,
            brand: c.brand_name,
            category_id: c.category_id,
            category: c.category_name,
            course_category_name: c.course_category_name,
            type_id: c.type_id,
            type: c.type_name || (c.area === 0 ? '滿額券' : ''),
            amount: parseInt(c.amount),
            discount_rate: parseFloat(c.discount_rate),
            min_amount: parseInt(c.min_amount),
            min_quantity: parseInt(c.min_quantity),
            free: parseInt(c.free),
            valid_to: c.valid_to,
            area: c.area,
          }))
        setCoupons(formatted)
      })
  }, [refresh])

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
        return 'bg-orange-100 text-orange-800'
    }
  }

  // 剩幾天過期
  const getDaysLeft = (validTo) => {
    const diff = dayjs(validTo).diff(dayjs(), 'day')
    return diff >= 0 ? `剩 ${diff} 天` : '已過期'
  }

  // 使用對象
  const getTargetScope = (coupon) => {
    const { brand, area } = coupon
    if (!brand && area === 0) return '全站通用'
    if (brand) return brand
  }

  // 更新優惠券
  const handleEdit = async (updatedCoupon) => {
    const token = localStorage.getItem('jwtToken')
    try {
      const res = await fetch(
        `http://localhost:3005/api/coupon/admin/${updatedCoupon.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedCoupon),
        }
      )
      const result = await res.json()
      console.log('更新回應內容：', result)

      if (!res.ok) throw new Error(result?.message || '更新失敗')

      setCoupons((prev) =>
        prev.map((c) => (c.id === updatedCoupon.id ? updatedCoupon : c))
      )

      toast.success('優惠券已更新')
    } catch (err) {
      console.error('更新優惠券錯誤:', err)
      toast.error('優惠券更新失敗')
    }
  }

  // 刪除優惠券
  const handleDelete = async (id) => {
    const token = localStorage.getItem('jwtToken')
    try {
      const res = await fetch(`http://localhost:3005/api/coupon/admin/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('刪除失敗')
      setCoupons((prev) => prev.filter((c) => c.id !== id))
      setShowSuccessAlert(true)
    } catch (err) {
      console.error('刪除失敗', err)
      toast.error('優惠券更新失敗')
    }
  }
  useEffect(() => {
    if (showSuccessAlert) {
      toast.success('優惠券已成功刪除')
      const timer = setTimeout(() => setShowSuccessAlert(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showSuccessAlert])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="hover:bg-transparent p-0 font-medium text-left"
          >
            id
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => row.original.id,
      },
      {
        accessorKey: 'title',
        header: '優惠名稱',
        cell: ({ row }) => row.original.title,
      },
      {
        accessorKey: 'brand',
        header: '品牌',
        cell: ({ row }) => {
          const scope = getTargetScope(row.original)
          return scope === '全站通用' ? (
            <Badge className="bg-red-100 text-red-800">全站通用</Badge>
          ) : (
            <span>{scope}</span>
          )
        },
      },
      {
        accessorKey: 'type',
        header: '類型',
        cell: ({ row }) => (
          <span
            className={`flex-nowrap px-2 py-1 rounded text-sm ${getTypeStyle(row.original.type)}`}
          >
            {row.original.type}
          </span>
        ),
      },
      {
        accessorKey: 'description',
        header: '說明',
        cell: ({ row }) => row.original.description,
      },
      {
        accessorKey: 'valid_to',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="hover:bg-transparent p-0 font-medium text-left"
          >
            有效期限
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => {
          const date = row.original.valid_to
          return (
            <div>
              {dayjs(date).format('YYYY-MM-DD')}（{getDaysLeft(date)}）
            </div>
          )
        },
      },
      {
        id: 'actions',
        header: '操作',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setSelectedCouponForDialog(row.original)}
                className="cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4" />
                查看詳情
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setEditCoupon(row.original)
                  setOriginalCoupon(row.original)
                }}
                className="cursor-pointer"
              >
                <Edit2 className="mr-2 h-4 w-4" />
                編輯優惠券
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteTarget(row.original)}
                className="cursor-pointer text-red-600 hover:!text-red-600 hover:!bg-red-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                刪除優惠券
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  )

  const table = useReactTable({
    data: coupons ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: 'includesString',
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    initialState: { pagination: { pageSize: 10 } },
  })

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl">商品優惠券管理</CardTitle>
          {/* <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" /> 新增優惠券
          </Button> */}
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="搜尋優惠名稱、品牌..."
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-4 py-2 text-center text-sm font-medium text-gray-500"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50">
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="px-4 py-3 text-sm text-center text-gray-700 whitespace-nowrap"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="text-center text-gray-500 py-6"
                      >
                        查無優惠券資料
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              第{' '}
              {coupons.length > 0
                ? table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                  1
                : 0}{' '}
              ~{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{' '}
              筆，共 {table.getFilteredRowModel().rows.length} 筆
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> 上一頁
              </Button>
              <span className="text-sm flex items-center">
                第 {table.getState().pagination.pageIndex + 1} /{' '}
                {table.getPageCount()} 頁
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                下一頁 <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 編輯 Dialog */}
      <Dialog open={!!editCoupon} onOpenChange={() => setEditCoupon(null)}>
        <DialogContent className="max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>編輯優惠券</DialogTitle>
          </DialogHeader>

          {/* 滾動內容區塊 */}
          <div className="overflow-y-auto pr-2 flex-1">
            {editCoupon && (
              <EditProductCoupon
                coupon={editCoupon}
                onChange={(field, value) =>
                  setEditCoupon((prev) => ({ ...prev, [field]: value }))
                }
                onCancel={() => setEditCoupon(null)}
                onSave={async () => {
                  const merged = {
                    course_categories_id: 0,
                    ...originalCoupon,
                    ...editCoupon,
                  }
                  await handleEdit(merged)
                  setRefresh((prev) => !prev) // 重新抓取資料
                  setEditCoupon(null)
                  // console.log('送出的 merged:', merged)
                }}
                brands={brands}
                categories={categories}
                types={types}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 查看詳情 */}
      <CouponDetailDialog
        coupon={selectedCouponForDialog}
        open={!!selectedCouponForDialog}
        onClose={() => setSelectedCouponForDialog(null)}
      />
      {/* 刪除優惠券 */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>確定要刪除優惠券？</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              優惠名稱：<strong>{deleteTarget?.title}</strong>
            </p>
            <p>刪除後將無法復原，請確認是否刪除？</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                取消
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  await handleDelete(deleteTarget.id)
                  setDeleteTarget(null)
                }}
              >
                確定刪除
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
