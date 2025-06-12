'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  Search,
  MoreHorizontal,
  Edit2,
  Trash2,
  Plus,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import DOMPurify from 'dompurify'
import '@/app/courses/_components/course-prose.scss'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

export default function CourseListPage() {
  const [data, setData] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const router = useRouter()
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCourses() {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch(
          'http://localhost:3005/api/courses-manage/course-list'
        )
        const json = await res.json()
        if (json.status === 'success') {
          setData(json.data)
        } else {
          throw new Error(json.message || '取得資料失敗')
        }
      } catch (error) {
        console.error('課程資料取得失敗', error)
        setError(error.message || '資料載入錯誤')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const handleEdit = (id) => {
    router.push(`/courses/edit/${id}`)
  }

  const handleDelete = async (id) => {
    if (!confirm('確定要刪除這堂課程嗎？')) return

    try {
      const res = await fetch(
        `http://localhost:3005/api/courses-manage/course-list/${id}/delete`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const result = await res.json()
      console.log('刪除回應', result)
      if (result.status === 'success') {
        // 更新畫面資料
        setData((prev) =>
          prev.map((course) =>
            course.id === id
              ? {
                  ...course,
                  status: 0,
                  remove: result.data.remove, // ⬅️ 後端要記得回傳 remove 時間戳
                  updated: new Date().toISOString(),
                }
              : course
          )
        )
        if (selectedCourse?.id === id) {
          setSelectedCourse((prev) =>
            prev ? { ...prev, status: 0, remove: result.data.remove } : prev
          )
        }
      } else {
        alert(result.message || '刪除失敗')
      }
    } catch (err) {
      console.error(err)
      alert('伺服器錯誤，請稍後再試')
    }
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="hover:bg-transparent p-0 font-medium text-left w-12" // ⬅️ 固定寬度
          >
            ID
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => <div className="w-12">{row.original.id}</div>, // 確保欄位寬度一致
      },
      {
        accessorKey: 'picture',
        header: '課程圖片',
        cell: ({ row }) => (
          <div className="relative h-[80px] w-[120px]">
            <Image
              src={`http://localhost:3005/images/course/bannerall/${row.original.picture}`}
              alt={row.original.title || 'course image'}
              fill
              className="object-contain rounded-md"
            />
          </div>
        ),
      },

      {
        accessorKey: 'title',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0"
          >
            課程名稱
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
          <div className="font-medium text-left">{row.original.title}</div>
        ),
      },
      {
        accessorKey: 'category_name',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0"
          >
            分類
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => <div>{row.original.category_name}</div>,
      },
      {
        accessorKey: 'teacher_name',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0"
          >
            講師
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => <div>{row.original.teacher_name}</div>,
      },
      {
        accessorKey: 'discount',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="hover:bg-transparent p-0 font-medium text-left"
          >
            售價
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
            NT$ {row.original.discount?.toLocaleString?.() ?? '—'}
          </div>
        ),
      },
      {
        accessorKey: 'student',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="hover:bg-transparent p-0 font-medium text-center"
          >
            學生人數
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
            {row.original.student?.toLocaleString?.() ?? '—'}
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0"
          >
            狀態
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
          const [isActive, setIsActive] = useState(row.original.status === 1)
          const [loading, setLoading] = useState(false)

          const toggleStatus = async () => {
            setLoading(true)
            try {
              const res = await fetch(
                `http://localhost:3005/api/courses-manage/course-list/${row.original.id}/toggle-status`,
                {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                }
              )
              const result = await res.json()
              if (result.status === 'success') {
                const updatedCourse = {
                  ...row.original,
                  status: result.data.status,
                  remove: result.data.remove, // 👈 把後端的 remove 日期一起更新進來
                  updated: result.data.updated,
                }
                // ✅ 1. 更新表格狀態
                setIsActive(result.data.status === 1)

                // ✅ 2. 更新主列表的資料
                setData((prevData) =>
                  prevData.map((course) =>
                    course.id === updatedCourse.id ? updatedCourse : course
                  )
                )

                // ✅ 3. 若目前正在檢視這堂課，就更新 Dialog 的資料
                setSelectedCourse((prev) =>
                  prev?.id === updatedCourse.id ? updatedCourse : prev
                )
              } else {
                alert(result.message || '切換失敗')
              }
            } catch (err) {
              console.error(err)
              alert('伺服器錯誤')
            } finally {
              setLoading(false)
            }
          }

          return (
            <div className="flex flex-col items-center">
              <button
                onClick={toggleStatus}
                disabled={loading}
                className={`text-sm px-2 py-1 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                }`}
              >
                {loading ? '更新中...' : isActive ? '上架中' : '已下架'}
              </button>

              {!isActive && row.original.remove && (
                <div className="text-xs text-gray-500 mt-1">
                  下架於{' '}
                  {new Date(row.original.remove).toLocaleDateString('zh-TW')}
                </div>
              )}
            </div>
          )
        },
      },
      {
        accessorKey: 'created',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="p-0"
          >
            建立日期
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
          const dateOnly = row.original.created?.slice(0, 10) || ''
          return <div className="text-sm text-gray-500">{dateOnly}</div>
        },
      },
      {
        id: 'actions',
        header: '操作',
        cell: ({ row }) => (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setSelectedCourse(row.original)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  查看詳情
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEdit(row.original.id)}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  編輯課程
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDelete(row.original.id)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  刪除課程
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ),
      },
    ],
    [router, data]
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: 'includesString',
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: { pageSize: 10 },
      sorting: [
        { id: 'created', desc: false }, // ❗預設用 created 欄，升冪排序
      ],
    },
  })

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">課程管理</CardTitle>
            <Button
              onClick={() => router.push('/courses/add')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              新增課程
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <DotLottieReact src="/loading.lottie" loop autoplay />
            </div>
          )}
          {error && (
            <div className="text-center text-red-500 py-10">
              發生錯誤：{error}
            </div>
          )}

          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="搜尋課程名稱、分類、講師..."
                value={globalFilter}
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
                          className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase"
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
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        尚無課程資料
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
      {selectedCourse && !isLoading && !error && (
        <Dialog
          open={!!selectedCourse}
          onOpenChange={() => setSelectedCourse(null)}
        >
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedCourse.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4 text-sm">
              <div className="flex justify-center">
                <Image
                  src={`http://localhost:3005/images/course/bannerall/${selectedCourse.picture}`}
                  alt={selectedCourse.title || '課程圖片'}
                  width={450}
                  height={240}
                  className="rounded-md object-contain"
                />
              </div>
              {selectedCourse.banner_video?.endsWith('.mp4') && (
                <div className="flex justify-center">
                  <video
                    className="rounded-md max-w-full max-h-[360px]"
                    controls
                    preload="metadata"
                  >
                    <source
                      src={`http://localhost:3005/images/course/bannerall/${selectedCourse.banner_video}`}
                      type="video/mp4"
                    />
                    您的瀏覽器不支援影片播放
                  </video>
                </div>
              )}

              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div>
                  <strong>分類：</strong> {selectedCourse.category_name || '—'}
                </div>
                <div>
                  <strong>講師：</strong> {selectedCourse.teacher_name || '—'}
                </div>
                <div>
                  <strong>售價：</strong> NT${' '}
                  {selectedCourse.discount?.toLocaleString?.() ?? '—'}
                </div>
                <div>
                  <strong>原價：</strong> NT${' '}
                  {selectedCourse.price?.toLocaleString?.() ?? '—'}
                </div>
                <div>
                  <strong>課程章節：</strong>{' '}
                  {selectedCourse.course_chapter || '—'}
                </div>
                <div>
                  <strong>課程時長：</strong>{' '}
                  {selectedCourse.video_length || '—'}
                </div>
                <div>
                  <strong>學生人數：</strong>{' '}
                  {selectedCourse.student?.toLocaleString?.() ?? '—'}
                </div>
                <div>
                  <strong>狀態：</strong>{' '}
                  {selectedCourse.status === 1 ? (
                    <Badge className="bg-green-100 text-green-800">
                      上架中
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">
                      已下架
                      {selectedCourse.remove &&
                        !isNaN(new Date(selectedCourse.remove)) && (
                          <>
                            {'（'}
                            {new Date(selectedCourse.remove).toLocaleString(
                              'zh-TW',
                              {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                            {'）'}
                          </>
                        )}
                    </Badge>
                  )}
                </div>
                <div>
                  <strong>建立日期：</strong>{' '}
                  {selectedCourse.created?.slice(0, 10) || '—'}
                </div>
                <div>
                  <strong>更新日期：</strong>{' '}
                  {selectedCourse.updated?.slice(0, 10) || '暫無更新'}
                </div>

                <div className="my-2 col-span-2">
                  <hr className="mb-3" />
                  <div className="my-5">
                    <span className=" font-medium">課程簡介：</span>
                    <p className="my-1 text-gray-600 whitespace-pre-wrap">
                      {selectedCourse?.detail || '無描述資訊'}
                    </p>
                  </div>
                  <span className=" font-medium">詳細內容：</span>
                  <div
                    className="prose my-1 text-gray-600"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        selectedCourse?.content || '無描述資訊'
                      ),
                    }}
                  />
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
