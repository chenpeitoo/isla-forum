import React, { useState, useEffect, useMemo } from 'react'
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
// ==== route ====
import { COURSE_BANNER_URL } from '@/_route/img-url'
// ==== css ====
import '../_style/like-list.css'
// ==== method ====
import { deleteWishItem } from '../_method/delete'

export default function WishCourseListTable() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const [globalFilter, setGlobalFilter] = useState('')
  const router = useRouter()

  const [course, setCourse] = useState([])
  const [reload, setReLoad] = useState(false) // 重新讀取的狀態(增減願望清單)

  const getCourse = async () => {
    const token = localStorage.getItem('jwtToken')
    if (!token) return console.log('未提供token')
    const response = await fetch(
      'http://localhost:3005/api/member/like-list/course',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()
    if (response.ok) {
      setCourse(data['data'])
    } else {
      console.log('讀取課程失敗')
      return
    }
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'image',
        header: '',
        cell: ({ row }) => (
          <Image
            src={`${COURSE_BANNER_URL}${row.original.picture}`}
            alt={row.original.title}
            width={48}
            height={48}
            className="rounded"
            style={{ objectFit: 'cover' }}
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
              href={`http://localhost:3000/product/${row.original.id}`}
              passHref
            >
              <div className="fw-bold">{row.original.title}</div>
            </Link>
            {/* <div className="text-muted small">{row.original.category_name}</div> */}
          </div>
        ),
      },
      // {
      //   accessorKey: 'brand',
      //   header: ({ column }) => (
      //     <button
      //       className="btn btn-link p-0 text-decoration-none"
      //       onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      //     >
      //       品牌
      //       {column.getIsSorted() === 'asc' ? (
      //         <BsArrowUpCircle className="ms-2" />
      //       ) : column.getIsSorted() === 'desc' ? (
      //         <BsArrowDownCircle className="ms-2" />
      //       ) : (
      //         <BsArrowDownCircle className="ms-2" />
      //       )}
      //     </button>
      //   ),
      //   cell: ({ row }) => (
      //     <span className="fw-semibold">{row.original.brand_name}</span>
      //   ),
      // },
      {
        accessorKey: 'price',
        header: ({ column }) => (
          <button
            className="btn btn-link p-0 text-decoration-none"
            // onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
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
            NT$ {row.original.price.toLocaleString()}
          </span>
        ),
      },
      {
        accessorKey: 'delete',
        header: ({ column }) => (
          <button
            className="btn btn-link p-0 text-decoration-none"
            // onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
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
          <button
            onClick={() => {
              const delte = async () => {
                await deleteWishItem({ courses_id: row.original.id })
                setReLoad((prev) => !prev)
              }
              delte()
            }}
          >
            <i class="bi bi-trash-fill"></i>
          </button>
        ),
      },
    ],
    []
  )

  const table = useReactTable({
    data: course ?? [],
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

  console.log('like-list course: ', course)
  // ==== 取得商品 ====
  useEffect(() => {
    console.log('==== useEffect ====')
    getCourse()
  }, [])

  // ==== 重新讀取商品(資料庫有增減) ====
  useEffect(() => {
    console.log('==== useEffect Reload ====')
    getCourse()
  }, [reload])
  return (
    <div className="card w-100">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          {/*<thead className="table-light">*/}
          {/*{table.getHeaderGroups().map((headerGroup) => (*/}
          {/*  <tr key={headerGroup.id}>*/}
          {/*    {headerGroup.headers.map((header) => (*/}
          {/*      <th key={header.id}>*/}
          {/*        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}*/}
          {/*      </th>*/}
          {/*    ))}*/}
          {/*  </tr>*/}
          {/*))}*/}
          {/*</thead>*/}
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
