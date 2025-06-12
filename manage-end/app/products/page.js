// app/products/page.js
'use client'

import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation' // Import useRouter
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Search,
  MoreHorizontal,
  Edit2,
  Trash2,
  Eye,
  Plus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'react-toastify'
import isEqual from 'lodash.isequal'
import {
  useProductManageList,
  useDeleteProduct,
} from '@/hook/use-product-manage.js'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
// import { getProducts } from './data-controller.js'

export default function ProductListPage() {
  // const [data, setProducts] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedProductForDialog, setSelectedProductForDialog] = useState(null) // For the Eye icon dialog
  const router = useRouter() // Initialize router
  const { products, loading, refetch, productError } = useProductManageList()
  const [data, setData] = useState([])
  const { mutate: deleteProduct, isPending } = useDeleteProduct()

  useEffect(() => {
    if (products && !isEqual(products, data)) {
      setData(products)
    }
  }, [products])

  const handleEditProduct = (product_id) => {
    router.push(`/products/edit/${product_id}`)
  }

  const handleAddProduct = (product_id) => {
    router.push(`/products/add`)
  }

  const handleDelete = useCallback(
    (productId, productName) => {
      const isConfirmed = window.confirm(
        `您確定要刪除「${productName}」嗎？此操作無法復原。`
      )
      if (isConfirmed) {
        deleteProduct(productId, {
          onSuccess: () => {
            toast.success('刪除成功')
            refetch()
          },
          onError: () => {
            toast.error('刪除失敗')
          },
        })
      }
    },
    [deleteProduct]
  )

  const getStatusTag = (status) => {
    return status === 'active' ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        上架中
      </Badge>
    ) : (
      <Badge
        variant="secondary"
        className="bg-red-100 text-red-800 hover:bg-red-100"
      >
        已下架 {/* Changed from 已停用 for consistency */}
      </Badge>
    )
  }

  const getStockTag = (stock) => {
    if (stock === 0) {
      return <Badge variant="destructive">缺貨</Badge>
    } else if (stock <= 10) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          庫存不足
        </Badge>
      )
    } else {
      // Removed redundant stock >= 10 check
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          庫存充足
        </Badge>
      )
    }
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'product_id',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="hover:bg-transparent p-0 font-medium text-left"
          >
            商品ID
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.product_id}</div>
          </div>
        ),
      },
      {
        accessorKey: 'image',
        header: '商品圖片',
        cell: ({ row }) => (
          <Image
            src={`https://isla-image.chris142852145.workers.dev/${row.original.primary_image_url}`}
            alt={row.original.name}
            width={48} // explicit width for Next/Image
            height={48} // explicit height for Next/Image
            className="w-12 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform cursor-pointer"
            onClick={() => setSelectedProductForDialog(row.original)}
          />
        ),
      },
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="hover:bg-transparent p-0 font-medium text-left"
          >
            商品名稱
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div>
            <div
              className="font-medium cursor-pointer"
              onClick={() => setSelectedProductForDialog(row.original)}
            >
              {row.original.name}
            </div>
            <div className="text-sm text-gray-500">{row.original.category}</div>
          </div>
        ),
      },
      {
        accessorKey: 'brand',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="hover:bg-transparent p-0 font-medium text-left"
          >
            品牌
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">{row.original.brand_name}</div>
        ),
      },
      {
        accessorKey: 'price',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="hover:bg-transparent p-0 font-medium text-left"
          >
            價格
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className="font-medium">
            NT$ {row.original.base_price.toLocaleString()}
          </div>
        ),
      },
      {
        accessorKey: 'stock',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="hover:bg-transparent p-0 font-medium text-left"
          >
            庫存
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className="space-y-1">
            <div className="font-medium">{row.original.total_stock} 件</div>
            {getStockTag(row.original.total_stock)}
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: '狀態',
        cell: ({ row }) => getStatusTag(row.original.status),
      },
      {
        id: 'actions',
        header: '管理',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setSelectedProductForDialog(row.original)}
                className="cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4" />
                查看詳情
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleEditProduct(row.original.product_id)} // Updated
                className="cursor-pointer"
              >
                <Edit2 className="mr-2 h-4 w-4" />
                編輯商品
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  handleDelete(row.original.product_id, row.original.name)
                }
                className="cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                刪除商品
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [router]
  ) // Added router to dependencies if handleEditProduct is memoized with it
  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const search = filterValue.toLowerCase()
      const { product_id, name, brand_name, category } = row.original

      return (
        String(product_id).toLowerCase().includes(search) ||
        (name || '').toLowerCase().includes(search) ||
        (brand_name || '').toLowerCase().includes(search) ||
        (category || '').toLowerCase().includes(search)
      )
    },
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    initialState: { pagination: { pageSize: 10 } },
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <DotLottieReact src="/loading.lottie" loop autoplay />
      </div>
    )
  }
  if (productError) {
    return (
      <>
        <h1>ERROR: {productError.message}</h1>
      </>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">商品管理</CardTitle>
            <Button
              onClick={handleAddProduct}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              新增商品
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="搜尋商品名稱、品牌、分類..."
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
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap" // Adjusted styling
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
                      <tr
                        key={row.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap"
                          >
                            {' '}
                            {/* Adjusted styling */}
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
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        查無商品資料
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              顯示{' '}
              {table.getRowModel().rows.length > 0
                ? table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                  1
                : 0}{' '}
              到{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{' '}
              筆，共 {table.getFilteredRowModel().rows.length} 筆資料
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> 上一頁
              </Button>
              {/* Simple Page Number Display */}
              <span className="text-sm">
                第 {table.getState().pagination.pageIndex + 1} /{' '}
                {table.getPageCount() || 1} 頁
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                下一頁 <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 查看詳情 */}
      {selectedProductForDialog && (
        <Dialog
          open={!!selectedProductForDialog}
          onOpenChange={() => setSelectedProductForDialog(null)}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedProductForDialog.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="flex justify-center">
                <Image
                  src={`https://isla-image.chris142852145.workers.dev/${selectedProductForDialog.primary_image_url}`}
                  alt={selectedProductForDialog.name}
                  width={200} // Adjust as needed
                  height={200} // Adjust as needed
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <span className="font-medium">品牌：</span>{' '}
                  {selectedProductForDialog.brand_name}
                </div>
                <div>
                  <span className="font-medium">分類：</span>{' '}
                  {selectedProductForDialog.category_name}
                </div>
                <div>
                  <span className="font-medium">價格：</span> NT${' '}
                  {selectedProductForDialog.base_price.toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">庫存：</span>{' '}
                  {selectedProductForDialog.total_stock} 件{' '}
                  {getStockTag(selectedProductForDialog.total_stock)}
                </div>
                <div className="col-span-2">
                  <span className="font-medium">狀態：</span>{' '}
                  {getStatusTag(selectedProductForDialog.status)}
                </div>
                <div className="col-span-2">
                  <span className="font-medium">描述：</span>
                  <p className="mt-1 text-gray-600 whitespace-pre-wrap">
                    {selectedProductForDialog.description || '無描述資訊'}
                  </p>
                </div>
                <div className="col-span-2 text-xs text-gray-500">
                  <span className="font-medium">上次更新：</span>{' '}
                  {selectedProductForDialog.updated_at}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
