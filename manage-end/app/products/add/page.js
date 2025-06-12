'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import Select from 'react-select'
import AsyncSelect from 'react-select/async'
import { debounce } from 'lodash'
import {
  ArrowLeft,
  Save,
  CalendarIcon,
  UploadCloud,
  XCircle,
  PlusCircle,
  Zap,
} from 'lucide-react'
import Image from 'next/image'
import { format } from 'date-fns'
import { useMutipleOptions } from '@/hook/use-product-manage.js'
import { useCreateProduct } from '@/hook/use-new-product-add'
import { toast } from 'react-toastify'

const MAX_IMAGES = 5
const IMAGE_WORKER_URL = 'https://isla-image.chris142852145.workers.dev/'
const today = new Date()
const endDate = new Date()
endDate.setMonth(endDate.getMonth() + 1)

// DEMO data
const DEMO_DATA = {
  name: 'Cosnori 長久活性睫毛精華',
  price: '507',
  sale_price: '427',
  sale_start_date: today.toISOString().slice(0, 10),
  sale_end_date: endDate.toISOString().slice(0, 10),
  description:
    'Cosnori長久活性睫毛精華採用天然成分配方，溫和不刺激，專為睫毛健康設計。它能深層滋養睫毛根部，強化毛囊，促進睫毛自然生長，改善睫毛脆弱斷裂問題。持續使用可讓睫毛變得更加濃密、纖長且有彈性，打造自然迷人的眼妝效果。無論是日常妝容還是重要場合，都能展現明亮有神的雙眸，提升自信。適合各種膚質及敏感眼周，安全可靠，是睫毛護理的理想選擇。',
  colors: [
    {
      color_name: '透藍色',
      color_code: '#F8F8FF',
      stock_quantity: 50,
    },
    {
      color_name: '淡粉色',
      color_code: '#FFB6C1',
      stock_quantity: 30,
    },
  ],
}

export default function ProductCreatePage() {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const { mutate: createProduct, isPending } = useCreateProduct()
  const {
    data: optionData,
    isLoading: optionLoading,
    error: optionError,
  } = useMutipleOptions()

  // 初始化
  const [formData, setFormData] = useState({
    name: '',
    category_id: null,
    brand_id: null,
    tag_ids: [],
    price: '',
    description: '',
    status: 'active',
    images: [],
    sale_price: '',
    sale_start_date: null,
    sale_end_date: null,
    colors: [
      {
        color_name: '標準色',
        color_code: '#000000',
        stock_quantity: 0,
      },
    ],
    ingredient_ids: [],
  })

  const [imagePreviews, setImagePreviews] = useState([])

  const statusOptions = [
    { value: 'active', label: '上架中' },
    { value: 'inactive', label: '下架' },
  ]

  // DEMO快捷鍵
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd + Shift + O
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'O') {
        e.preventDefault()
        fillDemoData()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [optionData])

  const fillDemoData = () => {
    if (!optionData) {
      toast.error('選項資料尚未載入完成')
      return
    }

    const { brands, categories, tags } = optionData

    // 隨機分類、品牌
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)]
    const randomBrand = brands[Math.floor(Math.random() * brands.length)]
    const randomTags = tags
      .slice(0, Math.min(3, tags.length))
      .map((tag) => tag.value)
    const today = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + 1)

    setFormData((prev) => ({
      ...prev,
      name: DEMO_DATA.name,
      category_id: randomCategory?.value || null,
      brand_id: randomBrand?.value || null,
      tag_ids: randomTags,
      price: DEMO_DATA.price,
      sale_price: DEMO_DATA.sale_price,
      description: DEMO_DATA.description,
      colors: DEMO_DATA.colors,
      sale_start_date: today.toISOString().slice(0, 10),
      sale_end_date: endDate.toISOString().slice(0, 10),
    }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange =
    (field, isMulti = false) =>
    (selected) => {
      setFormData((prev) => ({
        ...prev,
        [field]: isMulti ? selected.map((opt) => opt.value) : selected.value,
      }))
    }

  const handleStatusChange = (selected) => {
    setFormData((prev) => ({ ...prev, status: selected.value }))
  }

  const handleDateChange = (name, date) => {
    setFormData((prev) => ({ ...prev, [name]: date }))
  }

  const handleColorChange = (index, field, value) => {
    const updatedColors = [...formData.colors]
    updatedColors[index][field] =
      field === 'stock_quantity' ? parseInt(value, 10) || 0 : value
    setFormData((prev) => ({ ...prev, colors: updatedColors }))
  }

  const handleAddColor = () => {
    setFormData((prev) => ({
      ...prev,
      colors: [
        ...prev.colors,
        { color_name: '', color_code: '#000000', stock_quantity: 0 },
      ],
    }))
  }

  const handleRemoveColor = (index) => {
    if (formData.colors.length <= 1) {
      toast.error('商品至少需要一種顏色規格。')
      return
    }
    const updatedColors = [...formData.colors]
    updatedColors.splice(index, 1)
    setFormData((prev) => ({ ...prev, colors: updatedColors }))
  }

  const handleIngredientsChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      ingredient_ids: selectedOptions
        ? selectedOptions.map((opt) => opt.value)
        : [],
    }))
  }

  const loadIngredientOptions = debounce((inputValue, callback) => {
    if (inputValue.length < 1) {
      callback([])
      return
    }
    fetch(`http://localhost:3005/api/ingredient/search?q=${inputValue}`)
      .then((res) => res.json())
      .then((data) => callback(data))
      .catch(() => callback([]))
  }, 500)

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files)
    const currentImageCount = imagePreviews.length
    e.target.value = null

    if (files.length + currentImageCount > MAX_IMAGES) {
      toast.error(
        `最多只能上傳 ${MAX_IMAGES} 張圖片。您目前有 ${currentImageCount} 張，還能選擇 ${MAX_IMAGES - currentImageCount} 張。`
      )
      return
    }

    setIsUploading(true)
    toast.info('圖片上傳中，請稍候...')

    try {
      const uploadPromises = files.map((file) => uploadFileToR2(file))
      const newImageUrls = await Promise.all(uploadPromises)

      const combinedImages = [...formData.images, ...newImageUrls].slice(
        0,
        MAX_IMAGES
      )
      setFormData((prev) => ({ ...prev, images: combinedImages }))
      setImagePreviews(combinedImages)
      toast.success('所有圖片上傳成功！')
    } catch (error) {
      console.error('圖片上傳過程中發生錯誤:', error)
      toast.error(`圖片上傳失敗: ${error.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = (indexToRemove) => {
    const updatedImages = formData.images.filter(
      (_, index) => index !== indexToRemove
    )
    setFormData((prev) => ({ ...prev, images: updatedImages }))
    setImagePreviews(updatedImages)
  }

  const uploadFileToR2 = async (file) => {
    const workerUrl = new URL(IMAGE_WORKER_URL)
    workerUrl.searchParams.set('filename', encodeURIComponent(file.name))
    try {
      const response = await fetch(workerUrl.toString(), {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`上傳失敗: ${errorText}`)
      }
      const result = await response.json()
      if (!result.success || !result.url) {
        throw new Error('Worker 回應格式不正確，缺少 url。')
      }
      return result.url
    } catch (error) {
      console.error(`上傳檔案 ${file.name} 時發生錯誤:`, error)
      throw error
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // --- 表單驗證 ---
    if (isUploading) return toast.error('圖片正在上傳中，請稍候。')
    if (isPending) return
    if (formData.images.length === 0)
      return toast.error('請至少上傳一張商品圖片。')
    if (!formData.name.trim()) return toast.error('請輸入商品名稱。')
    if (!formData.category_id) return toast.error('請選擇商品分類。')
    if (!formData.brand_id) return toast.error('請選擇商品品牌。')
    if (!formData.price || parseFloat(formData.price) <= 0)
      return toast.error('請輸入有效的商品價格。')
    if (!formData.description.trim()) return toast.error('請輸入商品描述。')

    // 準備提交的資料
    const imagePathsForSubmission = formData.images.map((url) =>
      url.startsWith(IMAGE_WORKER_URL)
        ? url.substring(IMAGE_WORKER_URL.length)
        : url
    )

    const productDataForSubmission = {
      ...formData,
      base_price: parseInt(formData.price),
      sale_price: formData.sale_price ? parseInt(formData.sale_price) : null,
      sale_start_date: formData.sale_start_date
        ? format(new Date(formData.sale_start_date), 'yyyy-MM-dd')
        : null,
      sale_end_date: formData.sale_end_date
        ? format(new Date(formData.sale_end_date), 'yyyy-MM-dd')
        : null,
      images: imagePathsForSubmission,
      colors: formData.colors.map((color) => ({
        ...color,
        stock_quantity: parseInt(color.stock_quantity, 10) || 0,
      })),
      // ingredient_ids 已經在 formData 中，會被 ...formData 包含
    }

    createProduct(productDataForSubmission)
  }

  // --- 載入與錯誤狀態 ---

  if (optionLoading) {
    return <div className="p-8 text-center">載入設定選項中...</div>
  }

  if (optionError) {
    return (
      <div className="p-8 text-center text-red-500">
        載入設定失敗: {optionError.message}
      </div>
    )
  }

  const { brands, categories, tags } = optionData

  // 獲取當前選中的狀態選項
  const selectedStatusOption = statusOptions.find(
    (option) => option.value === formData.status
  )

  // --- 渲染元件 ---

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">新增商品</CardTitle>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={fillDemoData}
                className="bg-stone-50 hover:bg-stone-50"
              ></Button>
              <Button variant="outline" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" /> 返回列表
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 商品圖片區塊 */}
            <section>
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                商品圖片 (至少 1 張，最多 {MAX_IMAGES} 張)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {imagePreviews.map((src, index) => (
                  <div
                    key={index}
                    className="relative group border rounded-md overflow-hidden aspect-square"
                  >
                    <Image
                      src={src}
                      alt={`預覽 ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 opacity-75 group-hover:opacity-100"
                      onClick={() => removeImage(index)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {imagePreviews.length < MAX_IMAGES && (
                  <div className="border-2 border-dashed rounded-md flex items-center justify-center aspect-square">
                    <Label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center cursor-pointer w-full h-full p-4 text-center"
                    >
                      <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        點擊上傳 ({imagePreviews.length}/{MAX_IMAGES})
                      </span>
                      <Input
                        id="image-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={
                          imagePreviews.length >= MAX_IMAGES || isUploading
                        }
                      />
                    </Label>
                  </div>
                )}
              </div>
            </section>

            {/* 基本資訊區塊 */}
            <section>
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                基本資訊 (必填)
              </h3>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name">商品名稱</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="category">分類</Label>
                    <Select
                      id="category"
                      options={categories}
                      value={categories.find(
                        (cat) => cat.value === formData.category_id
                      )}
                      onChange={handleSelectChange('category_id')}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="brand">品牌</Label>
                    <Select
                      id="brand"
                      options={brands}
                      value={brands.find(
                        (brand) => brand.value === formData.brand_id
                      )}
                      onChange={handleSelectChange('brand_id')}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="price">價格 (NT$)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="1"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">商品狀態</Label>
                    <Select
                      options={statusOptions}
                      value={selectedStatusOption} // 修復：使用受控組件
                      onChange={handleStatusChange}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="tags">Tags (選填)</Label>
                  <Select
                    isMulti
                    id="tags"
                    options={tags}
                    value={tags.filter((tag) =>
                      formData.tag_ids.includes(tag.value)
                    )}
                    onChange={handleSelectChange('tag_ids', true)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="description">商品描述</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="mt-1"
                  />
                </div>
              </div>
            </section>

            {/* 商品成分區塊 */}
            <section>
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                商品成分 (選填)
              </h3>
              <AsyncSelect
                isMulti
                cacheOptions
                defaultOptions
                loadOptions={loadIngredientOptions}
                onChange={handleIngredientsChange}
                placeholder="輸入關鍵字搜尋並新增成分..."
                noOptionsMessage={({ inputValue }) =>
                  inputValue ? '找不到符合的成分' : '搜尋並加入成分...'
                }
                loadingMessage={() => '搜尋中...'}
                className="mt-1"
                styles={{ menu: (base) => ({ ...base, zIndex: 10 }) }} // 避免月曆等元件遮擋
              />
            </section>

            {/* 顏色與庫存區塊 */}
            <section>
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                顏色與庫存 (至少一項)
              </h3>
              <div className="space-y-4">
                {formData.colors.map((color, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-4 border rounded-md"
                  >
                    <div>
                      <Label>顏色名稱</Label>
                      <Input
                        value={color.color_name}
                        onChange={(e) =>
                          handleColorChange(index, 'color_name', e.target.value)
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>顏色預覽</Label>
                      <Input
                        type="color"
                        value={color.color_code}
                        onChange={(e) =>
                          handleColorChange(index, 'color_code', e.target.value)
                        }
                        className="mt-1 h-10 w-full p-0"
                      />
                    </div>
                    <div>
                      <Label>庫存數量</Label>
                      <Input
                        type="number"
                        value={color.stock_quantity}
                        onChange={(e) =>
                          handleColorChange(
                            index,
                            'stock_quantity',
                            e.target.value
                          )
                        }
                        min="0"
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-end h-full">
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleRemoveColor(index)}
                        className="w-full"
                        disabled={formData.colors.length <= 1}
                      >
                        移除
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddColor}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> 新增顏色規格
                </Button>
              </div>
            </section>

            {/* 特價管理區塊 */}
            <section>
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                特價管理 (選填)
              </h3>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="sale_price">特價價格 (NT$)</Label>
                  <Input
                    id="sale_price"
                    name="sale_price"
                    type="number"
                    value={formData.sale_price}
                    onChange={handleChange}
                    min="0"
                    placeholder="留空表示無特價"
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="sale_start_date">特價開始日期</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className="w-full justify-start text-left font-normal mt-1"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.sale_start_date ? (
                            format(formData.sale_start_date, 'PPP')
                          ) : (
                            <span>選擇日期</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.sale_start_date}
                          onSelect={(date) =>
                            handleDateChange('sale_start_date', date)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <Label htmlFor="sale_end_date">特價結束日期</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          className="w-full justify-start text-left font-normal mt-1"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.sale_end_date ? (
                            format(formData.sale_end_date, 'PPP')
                          ) : (
                            <span>選擇日期</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.sale_end_date}
                          onSelect={(date) =>
                            handleDateChange('sale_end_date', date)
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </section>

            {/* 提交按鈕 */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push('/admin/products')}
              >
                取消
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={isPending || isUploading}
              >
                {isPending ? (
                  '儲存中...'
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> 新增商品
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
