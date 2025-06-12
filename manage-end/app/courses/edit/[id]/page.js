'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import DOMPurify from 'dompurify'
import { Badge } from '@/components/ui/badge'
import dynamic from 'next/dynamic'
import '../../_components/tiptap-editor/tiptap-editor'
import CourseEditor from '../../_components/course-editor/course-editor'
import '@/app/courses/_components/course-prose.scss'
import { ArrowLeft, Trash2, Pencil, Save } from 'lucide-react'
import { toast } from 'react-toastify'

const theme = {
  paragraph: 'mb-2',
  heading: {
    h1: 'text-2xl font-bold',
    h2: 'text-xl font-semibold',
    h3: 'text-lg font-medium',
  },
}

export default function EditCoursePage() {
  const { id } = useParams()
  const router = useRouter()
  const [course, setCourse] = useState(null)
  const [initialCourse, setInitialCourse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isEditMode, setIsEditMode] = useState(true)
  const [categories, setCategories] = useState([])
  const [teachers, setTeachers] = useState([])
  const [errorFields, setErrorFields] = useState([])

  useEffect(() => {
    async function fetchAll() {
      try {
        const [courseRes, categoryRes, teacherRes] = await Promise.all([
          fetch(
            `http://localhost:3005/api/courses-manage/course-list/course/${id}`
          ),
          fetch(
            `http://localhost:3005/api/courses-manage/course-list/categories`
          ),
          fetch(
            `http://localhost:3005/api/courses-manage/course-list/teachers`
          ),
        ])

        const teacherJson = await teacherRes.json()
        if (teacherJson.status === 'success') setTeachers(teacherJson.data)

        if (!courseRes.ok || !categoryRes.ok) {
          throw new Error('API 錯誤，請檢查路由或伺服器回應')
        }

        const courseJson = await courseRes.json()
        const categoryJson = await categoryRes.json()

        if (courseJson.status === 'success') {
          const cleaned = {
            ...courseJson.data,
            title: courseJson.data.title || '',
            price: courseJson.data.price || '',
            discount: courseJson.data.discount || '',
            detail: courseJson.data.detail || '',
            content: courseJson.data.content || '',
            course_chapter: courseJson.data.course_chapter || '',
            video_length: courseJson.data.video_length || '',
            categories_id: courseJson.data.categories_id || '',
            teacher_name: courseJson.data.teacher_name || '',
            teacher_id: courseJson.data.teacher_id || '',
          }
          setCourse(cleaned)
          setInitialCourse(cleaned)
        }

        if (categoryJson.status === 'success') setCategories(categoryJson.data)
      } catch (err) {
        console.error('載入資料失敗：', err)
        alert('資料載入失敗，請檢查 API 是否正常')
      }
    }

    fetchAll()
  }, [id])

  const handleDeleteCourse = async () => {
    if (!confirm('確定要刪除此課程嗎？')) return

    try {
      const res = await fetch(
        `http://localhost:3005/api/courses-manage/course-list/${id}/delete`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
        }
      )
      const result = await res.json()
      if (result.status === 'success') {
        alert('課程已刪除（軟刪除）')
        router.push('/courses') // 刪除後導回課程列表
      } else {
        alert(result.message || '刪除失敗')
      }
    } catch (err) {
      console.error('刪除課程失敗:', err)
      alert('伺服器錯誤，刪除失敗')
    }
  }

  const handleRestoreCourse = async () => {
    if (!confirm('確定要上架此課程嗎？')) return

    try {
      const res = await fetch(
        `http://localhost:3005/api/courses-manage/course-list/${id}/restore`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
        }
      )
      const result = await res.json()

      if (result.status === 'success') {
        alert('課程已上架')

        // ✅ 立即更新前端狀態，讓畫面反應「已上架」
        setCourse((prev) => ({
          ...prev,
          status: 1,
          remove: null,
        }))
      } else {
        alert(result.message || '上架失敗')
      }
    } catch (err) {
      console.error('上架課程失敗:', err)
      alert('伺服器錯誤，無法上架')
    }
  }

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('courseId', id)

    try {
      const res = await fetch(
        `http://localhost:3005/api/courses-manage/course-list/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )

      const text = await res.text()
      let result = {}
      try {
        result = JSON.parse(text)
      } catch (err) {
        console.error('不是 JSON，回傳內容是：', text)
        throw new Error('圖片上傳格式錯誤')
      }

      if (result.status === 'success') {
        setCourse((prev) => ({
          ...prev,
          [type]: result.url.split('/').pop(), // 只存檔名
        }))
      } else {
        alert('上傳失敗：' + result.message)
      }
    } catch (err) {
      console.error('上傳錯誤:', err)
      alert('伺服器錯誤，請稍後再試')
    }

    e.target.value = ''
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setCourse((prev) => ({ ...prev, [name]: value }))
  }

  const getChangedFields = () => {
    if (!initialCourse || !course) return {}
    const changed = {}

    for (const key in course) {
      if (course[key] !== initialCourse[key]) {
        changed[key] = course[key]
      }
    }

    // 🔴 移除不能寫入 DB 的欄位
    delete changed.teacher_name

    return changed
  }

  const handleSubmit = async () => {
    // 🔍 必填欄位驗證（price 除外）
    const requiredFields = [
      'title',
      'discount',
      'detail',
      'content',
      'course_chapter',
      'video_length',
      'categories_id',
      'teacher_id',
      'picture',
      'banner_video',
    ]

    const fieldLabels = {
      title: '課程名稱',
      discount: '課程售價',
      detail: '課程簡介',
      content: '課程內容',
      course_chapter: '章節資訊',
      video_length: '影片長度',
      categories_id: '課程分類',
      teacher_id: '講師',
      picture: '課程縮圖',
      banner_video: '介紹影片',
    }

    const emptyFields = requiredFields.filter(
      (key) => !course[key]?.toString().trim()
    )
    if (emptyFields.length > 0) {
      setErrorFields(emptyFields) // 記下錯誤欄位
      const missing = emptyFields.map((f) => fieldLabels[f] || f).join('、')
      toast.error(`請填寫所有必填欄位：${missing}`)
      return
    }

    setErrorFields([]) // 清除錯誤欄位

    const changedFields = getChangedFields()
    if (Object.keys(changedFields).length === 0) {
      toast.info('沒有任何欄位需要更新')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(
        `http://localhost:3005/api/courses-manage/course-list/course/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(changedFields),
        }
      )
      const json = await res.json()
      if (json.status === 'success') {
        toast.success('更新成功')
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setIsEditMode(false)
        setInitialCourse(course)
      } else {
        toast.error(json.message || '更新失敗')
      }
    } catch (err) {
      console.error(err)
      toast.error('伺服器錯誤')
    } finally {
      setLoading(false)
    }
  }

  if (!course) return <div className="p-6">載入中...</div>

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={() => router.push('/courses')}>
          <ArrowLeft className="w-4 h-4" />
          返回列表
        </Button>
      </div>
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? '編輯課程' : `課程詳情：${course.title}`}
      </h1>
      {course.status === 0 && course.remove && (
        <p className="text-xl text-red-600 mt-1">
          ⚠️ 此課程已下架，時間：
          {new Date(course.remove).toLocaleDateString('zh-TW')}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 space-y-4">
          <div>
            {/* 課程縮圖 */}
            <Label className="my-2">
              {' '}
              課程縮圖：
              {errorFields.includes('picture') && (
                <span className="text-red-500 ml-1">※必填</span>
              )}
            </Label>
            {isEditMode ? (
              <>
                <label className="inline-block px-3 py-1 bg-black text-white rounded cursor-pointer hover:bg-gray-800 transition">
                  上傳圖片
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'picture')}
                  />
                </label>
                <img
                  src={`http://localhost:3005/images/course/bannerall/${course.picture}`}
                  alt="預覽圖片"
                  className={`w-full rounded border mt-2 ${errorFields.includes('picture') ? 'border-red-500' : ''}`}
                />
              </>
            ) : (
              <img
                src={`http://localhost:3005/images/course/bannerall/${course.picture}`}
                alt="課程圖片"
                className="w-full rounded border"
              />
            )}
          </div>

          <div>
            {/* 介紹影片 */}
            <Label className="my-2">介紹影片：</Label>
            {isEditMode ? (
              <>
                <label className="inline-block px-3 py-1 bg-black text-white rounded cursor-pointer hover:bg-gray-800 transition">
                  上傳影片
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'banner_video')}
                  />
                </label>
                {course.banner_video?.endsWith('.mp4') && (
                  <video
                    className="w-full mt-2"
                    controls
                    src={`http://localhost:3005/images/course/bannerall/${course.banner_video}`}
                  />
                )}
              </>
            ) : (
              course.banner_video?.endsWith('.mp4') && (
                <video
                  className="w-full"
                  controls
                  src={`http://localhost:3005/public/images/course/bannerall/${course.banner_video}`}
                />
              )
            )}
          </div>

          <div>
            <Label className="my-2">
              課程名稱：
              {isEditMode && errorFields.includes('title') && (
                <span className="text-red-500 ml-1">※必填</span>
              )}
            </Label>
            {isEditMode ? (
              <Input
                name="title"
                value={course.title}
                onChange={handleChange}
                className={
                  errorFields.includes('title') ? 'border-red-500' : ''
                }
              />
            ) : (
              <div>{course.title}</div>
            )}
          </div>

          <div>
            <Label className="my-2">課程簡介：</Label>
            {isEditMode ? (
              <Textarea
                name="detail"
                value={course.detail}
                onChange={handleChange}
                rows={3}
              />
            ) : (
              <p>{course.detail}</p>
            )}
          </div>
          <div>
            <Label>章節資訊：</Label>
            <Input
              name="course_chapter"
              value={course.course_chapter}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>影片長度：</Label>
            <Input
              name="video_length"
              value={course.video_length}
              onChange={handleChange}
            />
          </div>

          <Label>分類：</Label>
          {isEditMode ? (
            <select
              name="categories_id"
              value={course.categories_id}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="">請選擇分類：</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          ) : (
            <p>
              {categories.find((cat) => cat.id === course.categories_id)
                ?.name || '—'}
            </p>
          )}

          <Label>講師：</Label>
          {isEditMode ? (
            <select
              name="teacher_id"
              value={course.teacher_id}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="">請選擇講師</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          ) : (
            <p>
              {teachers.find((t) => t.id === course.teacher_id)?.name || '—'}
            </p>
          )}

          <div>
            <Label className="my-2">課程定價：</Label>
            {isEditMode ? (
              <Input
                name="price"
                type="number"
                value={course.price}
                onChange={handleChange}
              />
            ) : (
              <div>NT$ {Number(course.price).toLocaleString()}</div>
            )}
          </div>
          <div>
            <Label className="my-2">課程售價：</Label>
            {isEditMode ? (
              <Input
                name="discount"
                type="number"
                value={course.discount}
                onChange={handleChange}
              />
            ) : (
              <div>NT$ {Number(course.discount).toLocaleString()}</div>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <Label className="my-4">課程內容：</Label>
          {isEditMode ? (
            <CourseEditor
              value={course.content}
              courseId={course.id}
              onChange={(html) => {
                setCourse((prev) => ({ ...prev, content: html }))
              }}
            />
          ) : (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(course.content || '無內容'),
              }}
            />
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <div>
          {!isEditMode && course.status === 1 && (
            <Button
              variant="destructive"
              onClick={handleDeleteCourse}
              className="bg-red-600 hover:bg-red-700"
            >
              {' '}
              <Trash2 className="w-4 h-4" />
              刪除課程
            </Button>
          )}
          {!isEditMode && course.status === 0 && (
            <Button
              onClick={handleRestoreCourse}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              上架課程
            </Button>
          )}
        </div>

        <div className="flex gap-3">
          {isEditMode ? (
            <>
              <Button variant="outline" onClick={() => setIsEditMode(false)}>
                取消
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {' '}
                <Save className="w-4 h-4" />
                {loading ? '更新中...' : '完成編輯'}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditMode(true)}>
              {' '}
              <Pencil className="w-4 h-4" />
              編輯
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
