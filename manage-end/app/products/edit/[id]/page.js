'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import Select from 'react-select'
import {
  ArrowLeft,
  Save,
  CalendarIcon,
  UploadCloud,
  XCircle,
  PlusCircle,
} from 'lucide-react'
import Image from 'next/image'
import { format, isValid, parseISO } from 'date-fns' // For date handling
import { UseProductEditDetail } from '@/hook/use-products.js'
import { useMutipleOptions } from '@/hook/use-product-manage.js'
import { useUpdateProduct } from '@/hook/use-new-product-edit'
import imageCompression from 'browser-image-compression'

import prev from '@/next.config.mjs'
import { toast } from 'react-toastify'
const MAX_IMAGES = 5

export default function ProductEditPage({ params }) {
  const router = useRouter()
  const resolvedParams = React.use(params)
  const { id } = resolvedParams
  const productId = id
  const { products, loading, error } = UseProductEditDetail(productId)
  const product = products?.product
  const [imagePreview, setImagePreview] = useState([])
  const [imageFiles, setImageFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const { mutate: updateProduct, isPending } = useUpdateProduct()
  const {
    data: optionData,
    isLoading: optionLoading,
    error: optionError,
  } = useMutipleOptions()

  // 初始化空的表單狀態
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    tag_ids: [],
    brand_id: '',
    price: '',
    stock: '',
    status: 'active',
    description: '',
    images: [],
    sale_price: '',
    sale_start_date: null,
    sale_end_date: null,
    colors: [],
  })

  const statusOptions = [
    {
      value: 'active',
      label: '上架中',
    },
    {
      value: 'inactive',
      label: '下架',
    },
  ]

  const [imagePreviews, setImagePreviews] = useState([]) // 與 formData.images 保持一致，用於顯示
  const [isFormInitialized, setIsFormInitialized] = useState(false)
  const IMAGE_BASE_URL = 'https://isla-image.chris142852145.workers.dev/'
  const R2_PUBLIC_URL = 'https://isla-image.chris142852145.workers.dev/'
  const IMAGE_WORKER_URL = 'https://isla-image.chris142852145.workers.dev/'

  useEffect(() => {
    console.log('product:', product) // DB

    if (product && !isFormInitialized) {
      const imageObjectsFromDb = product.images || []

      // 產生圖片URL，保持簡單的字串陣列格式
      const showImagesWithFullUrl = imageObjectsFromDb
        .map((imgObj) => {
          const originImageName = imgObj?.image_url
          if (
            typeof originImageName === 'string' &&
            originImageName.trim() !== ''
          ) {
            // 檢查是否有 cloudFlare https
            if (originImageName.startsWith('https')) {
              return originImageName
            }
            return `${IMAGE_BASE_URL}${originImageName}`
          }
          console.warn('圖片 image_url 無效:', imgObj)
          return null
        })
        .filter(Boolean) // 移除任何 null 或 undefined 的結果

      const newFormData = {
        name: product.name || '',
        category_id: product.category?.category_id,
        tag_ids: product.tags?.map((tag) => tag.tag_id) || [],
        brand_id: product.brand?.brand_id,
        price:
          product.base_price?.toString() || product.price?.toString() || '',
        status: product.status || 'active',
        description: product.description || '',
        images: showImagesWithFullUrl, // 直接使用字串陣列
        sale_price: product.sale_price?.toString() || '',
        sale_start_date: product.sale_start_date
          ? parseISO(product.sale_start_date)
          : null,
        sale_end_date: product.sale_end_date
          ? parseISO(product.sale_end_date)
          : null,
        colors: Array.isArray(product.colors) ? product.colors : [],
      }

      setFormData(newFormData)
      setImagePreviews(showImagesWithFullUrl) // 與 formData.images 保持一致
      setIsFormInitialized(true)

      console.log('Form state after initialization:', newFormData)
      console.log('Image previews initialized with:', showImagesWithFullUrl)
    }
  }, [product, loading, error, isFormInitialized])

  // 處理表單輸入變更
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange =
    (field, isMulti = false) =>
    (selected) => {
      setFormData((prev) => ({
        ...prev,
        [field]: isMulti
          ? selected
            ? selected.map((opt) => opt.value)
            : []
          : selected
            ? selected.value
            : null,
      }))
    }

  const handleStatusChange = (value) => {
    setFormData((prev) => ({ ...prev, status: value }))
  }

  const handleDateChange = (name, date) => {
    setFormData((prev) => ({ ...prev, [name]: date }))
  }

  const handleColorChange = (index, field, value) => {
    const updatedColors = [...formData.colors]
    if (field === 'stock_quantity') {
      updatedColors[index][field] = parseInt(value, 10) || 0
    } else {
      updatedColors[index][field] = value
    }
    setFormData((prev) => ({ ...prev, colors: updatedColors }))
  }

  const handleAddColor = () => {
    setFormData((prev) => ({
      ...prev,
      colors: [
        ...prev.colors,
        {
          color_name: '',
          color_code: '#000000',
          stock_quantity: 0,
          stock_id: null,
        },
      ],
    }))
  }

  const handleRemoveColor = (index) => {
    const updatedColors = [...formData.colors]
    updatedColors.splice(index, 1)
    setFormData((prev) => ({ ...prev, colors: updatedColors }))
  }

  const renderImagePreviews = () => {
    if (!imagePreviews || imagePreviews.length === 0) {
      return (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
          <p className="text-gray-500">尚未上傳任何圖片</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {imagePreviews
          .map((previewSrc, index) => {
            // 確保 previewSrc 不是空字串或 null/undefined
            if (!previewSrc || previewSrc.trim() === '') {
              console.warn(`圖片預覽 ${index} 的 src 為空:`, previewSrc)
              return null // 不渲染這個圖片
            }

            return (
              <div
                key={index}
                className="relative group border rounded-md overflow-hidden aspect-square"
              >
                <Image
                  src={previewSrc}
                  alt={`預覽圖 ${index + 1}`}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    console.error(`圖片載入失敗 (index: ${index}):`, previewSrc)
                    // 可以設置一個預設圖片或隱藏該圖片
                    e.target.style.display = 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
                {formData.images[index]?.is_primary && (
                  <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    主圖
                  </div>
                )}
              </div>
            )
          })
          .filter(Boolean)}{' '}
        {/* 過濾掉 null 值 */}
      </div>
    )
  }

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files)
    const currentImageCount = imagePreviews.length
    e.target.value = null // 清空 input，以便下次可以選擇同一個檔案

    if (files.length + currentImageCount > MAX_IMAGES) {
      toast.error(
        `最多只能上傳 ${MAX_IMAGES} 張圖片。您目前有 ${currentImageCount} 張，還能選擇 ${MAX_IMAGES - currentImageCount} 張。`
      )
      return
    }

    setIsUploading(true)
    toast.info('圖片上傳中，請稍候...')

    try {
      // 建立一個包含所有上傳 promise 的陣列
      const uploadPromises = files.map((file) => uploadFileToR2(file))

      // 等待所有圖片都上傳完成
      const newImageUrls = await Promise.all(uploadPromises)

      // 上傳成功後，更新 state
      const combinedImages = [...formData.images, ...newImageUrls].slice(
        0,
        MAX_IMAGES
      )

      setFormData((prev) => ({ ...prev, images: combinedImages }))
      setImagePreviews(combinedImages)
      toast.success('所有圖片上傳成功！')
    } catch (error) {
      console.error('在上傳過程中發生錯誤:', error)
      toast.error(`圖片上傳失敗: ${error.message}`)
    } finally {
      setIsUploading(false)
    }
  }
  const removeImage = (indexToRemove) => {
    const updatedImages = formData.images.filter(
      (_, index) => index !== indexToRemove
    )
    const updatedFiles = imageFiles.filter(
      (_, index) => index !== indexToRemove
    )

    setFormData((prev) => ({ ...prev, images: updatedImages }))
    setImagePreviews(updatedImages) // 直接使用 updatedImages，因為格式一致
    setImageFiles(updatedFiles)
  }

  const handleSubmit = (e) => {
    // handleSubmit 現在不再需要是 async
    e.preventDefault()

    // 檢查圖片是否還在上傳 (這部分邏輯保留)
    if (isUploading) {
      toast.error('圖片正在上傳中，請稍候再儲存。')
      return
    }

    // 檢查是否正在提交中，防止重複點擊
    if (isPending) {
      return
    }

    const imagePathsForSubmission = formData.images.map((url) => {
      if (url.startsWith(IMAGE_WORKER_URL)) {
        return url.substring(IMAGE_WORKER_URL.length)
      }
      if (url.startsWith(R2_PUBLIC_URL)) {
        return url.substring(R2_PUBLIC_URL.length)
      }
      // 如果 URL 不符合任何已知的前綴，可能它是舊資料或已經是相對路徑，直接回傳
      return url
    })

    // 準備要提交的純 JSON 資料 (這部分邏輯保留)
    const productDataForSubmission = {
      ...formData,
      product_id: productId,
      base_price: parseInt(formData.price) || 0,
      sale_price: formData.sale_price ? parseInt(formData.sale_price) : null,
      sale_start_date: formData.sale_start_date
        ? format(new Date(formData.sale_start_date), 'yyyy-MM-dd')
        : null,
      sale_end_date: formData.sale_end_date
        ? format(new Date(formData.sale_end_date), 'yyyy-MM-dd')
        : null,
      images: imagePathsForSubmission,
      colors: formData.colors.map((color) => ({
        color_name: color.color_name,
        color_code: color.color_code || '#000000',
        stock_quantity: parseInt(color.stock_quantity, 10) || 0,
        stock_id: color.stock_id ?? null,
      })),
    }
    console.log('準備提交的相對路徑數據:', productDataForSubmission)
    console.log('準備提交的純 JSON 數據:', productDataForSubmission)

    // 3. 呼叫從 Hook 拿到的 updateProduct 函式，取代整個 try/catch 區塊
    //    剩下的成功/失敗通知、錯誤處理，React Query 會根據 Hook 中的設定自動完成。
    updateProduct(productDataForSubmission)
  }

  const uploadFileToR2 = async (file) => {
    const workerUrl = new URL('https://isla-image.chris142852145.workers.dev/')
    workerUrl.searchParams.set('filename', encodeURIComponent(file.name))

    try {
      const response = await fetch(workerUrl.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': file.type,
        },
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

      console.log(`檔案 ${file.name} 上傳成功，URL: ${result.url}`)
      return result.url
    } catch (error) {
      console.error(`上傳檔案 ${file.name} 時發生錯誤:`, error)
      throw error
    }
  }

  // 載入中
  if (loading || optionLoading) {
    return (
      <div className="container mx-auto p-8 text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4">載入中...</p>
      </div>
    )
  }

  // 錯誤
  if (error) {
    return (
      <div className="container mx-auto p-8 text-center text-red-500">
        <h2 className="text-xl font-bold mb-4">載入錯誤</h2>
        <p>{error}</p>
        <Button onClick={() => router.back()} className="mt-4">
          返回
        </Button>
      </div>
    )
  }

  // 商品不存在
  if (!product && !loading) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-xl font-bold mb-4">商品不存在</h2>
        <p>找不到 ID 為 {productId} 的商品。</p>
        <Button onClick={() => router.back()} className="mt-4">
          返回列表
        </Button>
      </div>
    )
  }

  const { brands, categories, tags } = optionData
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              編輯商品：{formData.name || '載入中...'}
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" /> 返回列表
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <section>
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                商品圖片 (最多 {MAX_IMAGES} 張)，第一張為主要圖片
              </h3>
              <div className="space-y-4">
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                    {imagePreviews.map((previewSrc, index) => (
                      <div
                        key={index}
                        className="relative group border rounded-md overflow-hidden aspect-square"
                      >
                        <Image
                          src={previewSrc}
                          alt={`商品圖片 ${index + 1}`}
                          layout="fill"
                          objectFit="cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 opacity-75 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="p-4 border-2 border-dashed rounded-md hover:border-blue-500 transition-colors">
                      <Label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center cursor-pointer"
                      >
                        <UploadCloud className="w-12 h-12 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                          點擊此處或拖曳圖片到此區域上傳
                        </span>
                        <Input
                          id="image-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          disabled={imagePreviews.length >= MAX_IMAGES}
                        />
                      </Label>
                    </div>
                  </div>
                )}
                {imagePreviews.length >= MAX_IMAGES && (
                  <p className="text-sm text-yellow-600 mt-2">
                    已達到圖片數量上限 ({MAX_IMAGES} 張)。
                  </p>
                )}
              </div>
            </section>
            {/* Basic Info Section */}
            <section>
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                基本資訊
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
                    placeholder="請輸入商品名稱"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="category">分類</Label>
                    <Select
                      id="category"
                      name="category"
                      options={categories}
                      value={categories.find(
                        (option) => option.value === formData.category_id
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
                      name="brand"
                      options={brands}
                      value={brands.find(
                        (option) => option.value === formData.brand_id
                      )}
                      onChange={handleSelectChange('brand_id')}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tag">Tags</Label>
                    <Select
                      isMulti
                      id="tags"
                      options={tags}
                      name="tags"
                      value={tags.filter((opt) =>
                        formData.tag_ids.includes(opt.value)
                      )}
                      onChange={handleSelectChange('tag_ids', true)}
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
                      min="0"
                      className="mt-1"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="status">狀態</Label>
                  <Select
                    name="status"
                    options={statusOptions}
                    value={statusOptions.find(
                      (option) => option.value === formData.status
                    )}
                    onValueChange={handleStatusChange}
                    required
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
                    rows={4}
                    className="mt-1"
                    placeholder="請輸入商品描述"
                  />
                </div>
              </div>
            </section>

            {/* Color Management Section */}
            <section>
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                顏色管理
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
                        placeholder="如：標準色、紅色..."
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>顏色代碼</Label>
                      <Input
                        type="color"
                        value={color.color_code || '#000000'}
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

            {/* Sale Price Section */}
            <section>
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                特價管理
              </h3>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="sale_price">特價價格 (NT$, 選填)</Label>
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

            {/* Image Upload Section */}

            <div className="flex justify-end space-x-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/products')}
              >
                取消
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Save className="mr-2 h-4 w-4" /> 儲存變更
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
