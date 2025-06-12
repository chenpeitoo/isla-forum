import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useWishProduct } from '@/hook/use-wish-with-product'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table'
import { BsArrowDownCircle, BsArrowUpCircle } from 'react-icons/bs'
import Image from 'next/image'
import Link from 'next/link'
import { useClientToken } from '@/hook/use-client-token.js'
import { useAuth } from '@/hook/use-auth.js'
import { toast } from 'react-toastify'
// ==== method ====
import { formatted } from '@/app/member/_method/method'
import { deleteWishItem } from '../_method/delete' // delete item

export default function WishProductListTable() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const token = useClientToken()
  const [globalFilter, setGlobalFilter] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const { data: product, isLoading, isError, refetch } = useWishProduct(token)

  const products = product || []
  console.log(product)

  const handleDelete = useCallback(
    async (productId) => {
      if (isDeleting) return

      try {
        setIsDeleting(true)
        await deleteWishItem({ product_id: productId })
        await refetch()
        toast.success('已從願望清單移除')
      } catch (error) {
        console.error('刪除失敗:', error)
        toast.error('刪除失敗，請稍後再試')
      } finally {
        setIsDeleting(false)
      }
    },
    [isDeleting, refetch]
  )

  const columns = useMemo(
    () => [
      {
        accessorKey: 'image',
        header: '',
        cell: ({ row }) => (
          <Image
            src={`https://isla-image.chris142852145.workers.dev/${row.original.images[0]}`}
            alt={row.original.name}
            width={48}
            height={48}
            className="rounded"
          />
        ),
      },
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <button
            className="btn btn-link p-0 text-decoration-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            收藏商品名稱
            {column.getIsSorted() === 'asc' ? (
              <BsArrowUpCircle className="ms-2" />
            ) : column.getIsSorted() === 'desc' ? (
              <BsArrowDownCircle className="ms-2" />
            ) : (
              <BsArrowDownCircle className="ms-2" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <div>
            <Link
              href={`http://localhost:3000/product/${row.original.product_id}`}
              passHref
            >
              <div className="fw-bold">{row.original.name}</div>
            </Link>
            <div className="text-muted small">{row.original.category_name}</div>
          </div>
        ),
      },
      {
        accessorKey: 'brand',
        header: ({ column }) => (
          <button
            className="btn btn-link p-0 text-decoration-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            品牌
            {column.getIsSorted() === 'asc' ? (
              <BsArrowUpCircle className="ms-2" />
            ) : column.getIsSorted() === 'desc' ? (
              <BsArrowDownCircle className="ms-2" />
            ) : (
              <BsArrowDownCircle className="ms-2" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <span className="fw-semibold">{row.original.brand_name}</span>
        ),
      },
      {
        accessorKey: 'price',
        header: ({ column }) => (
          <button
            className="btn btn-link p-0 text-decoration-none"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            價格
            {column.getIsSorted() === 'asc' ? (
              <BsArrowUpCircle className="ms-2" />
            ) : column.getIsSorted() === 'desc' ? (
              <BsArrowDownCircle className="ms-2" />
            ) : (
              <BsArrowDownCircle className="ms-2" />
            )}
          </button>
        ),
        cell: ({ row }) => (
          <span className="fw-semibold">
            NT$ {formatted(parseInt(row.original.final_price.toLocaleString()))}
          </span>
        ),
      },
      {
        accessorKey: 'delete',
        header: ({ column }) => (
          <button className="btn btn-link p-0 text-decoration-none">
            操作
          </button>
        ),
        cell: ({ row }) => (
          <button
            onClick={() => handleDelete(row.original.product_id)}
            disabled={isDeleting}
            title="從願望清單移除"
          >
            {isDeleting ? (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">刪除中...</span>
              </div>
            ) : (
              <i className="bi bi-trash-fill"></i>
            )}
          </button>
        ),
      },
    ],
    [isDeleting] // 依賴 isDeleting 狀態
  )

  const table = useReactTable({
    data: products,
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

  // 可選：如果需要在 token 變化時重新抓取資料
  useEffect(() => {
    if (token) {
      refetch()
    }
  }, [token])

  if (isLoading) {
    return (
      <div className="card w-100">
        <div className="text-center py-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">載入中...</span>
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="card w-100">
        <div className="text-center py-4 text-danger">
          載入失敗，請重新整理頁面
        </div>
      </div>
    )
  }

  return (
    <div className="card w-100">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
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
                  className="text-center py-4 text-muted"
                >
                  查無商品資料
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
