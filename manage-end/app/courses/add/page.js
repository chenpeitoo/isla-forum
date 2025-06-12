'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import dynamic from 'next/dynamic'
import '@/app/courses/_components/course-prose.scss'
import { Save, ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'
import { ClimbingBoxLoader } from 'react-spinners'

const CourseEditor = dynamic(
  () => import('../_components/course-editor/course-editor'),
  {
    ssr: false,
  }
)

export default function AddCoursePage() {
  const router = useRouter()
  const [course, setCourse] = useState({
    title: '',
    detail: '',
    content: '',
    categories_id: '',
    teacher_id: '',
    price: '',
    discount: '',
    picture: '',
    banner_video: '',
    course_chapter: '',
    video_length: '',
    tag: '1',
  })
  const [imageFile, setImageFile] = useState(null)
  const [videoFile, setVideoFile] = useState(null)
  const [categories, setCategories] = useState([])
  const [teachers, setTeachers] = useState([])
  const [errorFields, setErrorFields] = useState([])
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [videoPreview, setVideoPreview] = useState(null)

  useEffect(() => {
    async function fetchMeta() {
      try {
        const [catRes, teacherRes] = await Promise.all([
          fetch(
            'http://localhost:3005/api/courses-manage/course-list/categories'
          ),
          fetch(
            'http://localhost:3005/api/courses-manage/course-list/teachers'
          ),
        ])
        const catJson = await catRes.json()
        const teacherJson = await teacherRes.json()
        if (catJson.status === 'success') setCategories(catJson.data)
        if (teacherJson.status === 'success') setTeachers(teacherJson.data)
      } catch (err) {
        console.error('載入分類或講師失敗', err)
      }
    }
    fetchMeta()
  }, [])

  const handleEditorImageUpload = async (file) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('http://localhost:3005/api/upload-editor-image', {
        method: 'POST',
        body: formData,
      })
      const result = await res.json()
      if (result.status === 'success') {
        return `http://localhost:3005/images/course/course-list/${result.filename}`
      } else {
        toast.error(result.message || '圖片上傳失敗')
      }
    } catch (err) {
      console.error('圖片上傳錯誤', err)
      toast.error('伺服器錯誤')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setCourse((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    const requiredFields = [
      'title',
      'discount',
      'detail',
      'content',
      'categories_id',
      'teacher_id',
      'course_chapter',
      'video_length',
      'tag',
    ]
    const emptyFields = requiredFields.filter(
      (key) => !course[key]?.toString().trim()
    )

    if (!imageFile) emptyFields.push('picture')
    if (!videoFile) emptyFields.push('banner_video') // ✅ 新增這行

    if (emptyFields.length > 0) {
      setErrorFields(emptyFields)
      toast.error('請填寫所有必填欄位')
      return
    }
    setErrorFields([])
    const form = new FormData()
    Object.entries(course).forEach(([key, value]) => {
      if (key === 'tag') {
        form.append('tag', 1) // 強制數字型
      } else {
        form.append(key, value)
      }
    })

    if (imageFile) form.append('pictureFile', imageFile)
    if (videoFile) form.append('videoFile', videoFile)

    setLoading(true)
    try {
      const res = await fetch(
        'http://localhost:3005/api/courses-manage/course-list',
        {
          method: 'POST',
          body: form,
        }
      )
      const result = await res.json()
      if (result.status === 'success') {
        toast.success('課程新增成功')
        router.push('/courses')
      } else {
        toast.error(result.message || '新增失敗')
      }
    } catch (err) {
      console.error(err)
      toast.error('伺服器錯誤')
    } finally {
      setLoading(false)
    }
  }

  //
  // const handleFileChange = async (e) => {
  //   console.log('click')
  //   const file = e.target.files[0]
  //   const courseId = course.id
  //   if (!file) return

  //   const formData = new FormData()
  //   formData.append('file', file)
  //   formData.append('courseId', courseId)

  //   try {
  //     const res = await fetch(
  //       `http://localhost:3005/api/courses-manage/course-list/upload?courseId=${courseId}`,
  //       {
  //         method: 'POST',
  //         body: formData,
  //       }
  //     )

  //     const text = await res.text()
  //     let data = {}
  //     try {
  //       data = JSON.parse(text)
  //     } catch (err) {
  //       console.error('伺服器未回傳 JSON：', text)
  //       throw new Error('圖片上傳回傳格式錯誤')
  //     }

  //     if (data.url) {
  //       editor
  //         ?.chain()
  //         .focus()
  //         .setImage({
  //           src: `http://localhost:3005${data.url}`,
  //         })
  //         .run()
  //     } else {
  //       alert('圖片上傳失敗')
  //     }
  //   } catch (err) {
  //     console.error('上傳失敗:', err)
  //     alert('圖片上傳發生錯誤')
  //   } finally {
  //     e.target.value = ''
  //   }
  // }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={() => router.push('/courses')}>
          <ArrowLeft className="w-4 h-4" /> 返回列表
        </Button>
      </div>
      <h1 className="text-2xl font-bold mb-6">新增課程</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 space-y-4">
          <Label className="my-2">
            課程縮圖：
            {errorFields.includes('picture') && (
              <span className="text-red-500 ml-1">※必填</span>
            )}
          </Label>
          <label className="inline-block px-3 py-1 bg-black text-white rounded cursor-pointer hover:bg-gray-800 transition">
            上傳圖片
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0]
                setImageFile(file)
                if (file) {
                  setImagePreview(URL.createObjectURL(file))
                }
                console.log('change')
              }}
            />
          </label>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="預覽圖片"
              className={`w-full mt-2 rounded border ${
                errorFields.includes('picture') ? 'border-red-500' : ''
              }`}
            />
          )}

          <Label className="my-2">
            介紹影片：
            {errorFields.includes('banner_video') && (
              <span className="text-red-500 ml-1">※必填</span>
            )}
          </Label>
          <label className="inline-block px-3 py-1 bg-black text-white rounded cursor-pointer hover:bg-gray-800 transition">
            上傳影片
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0]
                setVideoFile(file)
                if (file) {
                  setVideoPreview(URL.createObjectURL(file))
                }
              }}
            />
          </label>
          {videoPreview && (
            <video
              className={`w-full mt-2 rounded border ${
                errorFields.includes('banner_video') ? 'border-red-500' : ''
              }`}
              controls
              src={videoPreview}
            />
          )}

          <div>
            <Label>課程名稱：</Label>
            <Input name="title" value={course.title} onChange={handleChange} />
          </div>
          <div>
            <Label>課程簡介：</Label>
            <Textarea
              name="detail"
              value={course.detail}
              onChange={handleChange}
              rows={3}
            />
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
          <div>
            <Label>分類：</Label>
            <select
              name="categories_id"
              value={course.categories_id}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">請選擇分類</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>講師：</Label>
            <select
              name="teacher_id"
              value={course.teacher_id}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">請選擇講師</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>定價：</Label>
            <Input
              name="price"
              type="number"
              value={course.price}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>售價：</Label>
            <Input
              name="discount"
              type="number"
              value={course.discount}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label className="my-2">標籤：</Label>
            <Input
              name="tag"
              value={course.tag === '1' ? '課程' : ''}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <Label className="my-4">
            課程內容：
            {errorFields.includes('content') && (
              <span className="text-red-500 ml-1">※必填</span>
            )}
          </Label>
          <div
            className={`rounded border ${
              errorFields.includes('content')
                ? 'border-red-500'
                : 'border-gray-300'
            }`}
          >
            <CourseEditor
              value={course.content}
              courseId={course.id}
              onChange={(html) =>
                setCourse((prev) => ({ ...prev, content: html }))
              }
              onImageUpload={handleEditorImageUpload}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <Button onClick={handleSubmit} disabled={loading}>
          <Save className="w-4 h-4" /> {loading ? '儲存中...' : '儲存課程'}
        </Button>
      </div>
    </div>
  )
}
