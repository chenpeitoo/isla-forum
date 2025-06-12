'use client'
import { useEffect, useState, useCallback, useMemo } from 'react'
import style from './review-editor.module.css'
import { Modal, Button, Form } from 'react-bootstrap'
import clsx from 'clsx'
import { useClientToken } from '@/hook/use-client-token.js'
import { useAuth } from '@/hook/use-auth.js'
import {toast} from "react-toastify";
import { useChrisR2ImageUrlDuo } from '@/hook/use-chris-r2image-url.js'
import './editor.css'

export default function ReviewEditor({
  product_Id,
  edit = null,
  editImages = [],
  onSubmit,
}) {
  const { user, isLoading: isAuthLoading } = useAuth()
  const token = useClientToken()
  const user_id = user?.id
  // console.log('review-editor')
  const [showModal, setShowModal] = useState(false)
  const [reviewID, setReviewId] = useState(null)
  const [reviewText, setReviewText] = useState('')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(null)

  // 圖片
  const [images, setImages] = useState([])
  const [imagePreview, setImagePreview] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [imageToDelete, setImageToDelete] = useState(new Set())

  // 使用 useCallback 包裝事件處理函數，避免不必要的重新創建
  const handleClose = useCallback(() => {
    setShowModal(false)
  }, [])

  const handleShow = useCallback(() => {
    if ( !user_id && !token ) {
      toast.warning('請先登入')
      setShowModal(false)
      return
    }
    setShowModal(true)
  }, [user_id, token])

  // 重置表單狀態
  useEffect(() => {
    if (edit) {
      setReviewId(edit.review_id)
      setReviewText(edit.comment_text)
      setRating(edit.rating)
    } else {
      setReviewId(null)
      setReviewText('')
      setRating(0)
    }
    setExistingImages(editImages || [])
    setImages([])
    setImagePreview([])
    setImageToDelete(new Set())
  }, [edit, editImages])

  // 清理 URL 對象，避免內存洩漏 \>_</
  useEffect(() => {
    return () => {
      imagePreview.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [imagePreview])

  const handleImageChange = useCallback(
    (e) => {
      const files = Array.from(e.target.files)
      if (!files.length) return

      const totalImagesCount =
        existingImages.length -
        imageToDelete.size +
        images.length +
        files.length

      if (totalImagesCount > 3) {
        toast.warning('最多只能上傳3張圖片')
        return
      }

      const validImages = files.filter((file) => file.type.startsWith('image/'))
      if (validImages.length < files.length) {
        toast.warning('不支援目前的圖片格式')
        return
      }

      const renamedImages = validImages.map((file, idx) => {
        const extension = file.name.split('.').pop()
        const newName = `${Date.now()}_${idx}.${extension}`
        return new File([file], newName, { type: file.type })
      })

      setImages((prev) => [...prev, ...renamedImages])

      // 創建新的預覽URLs
      const newPreviews = renamedImages.map((file) => URL.createObjectURL(file))
      setImagePreview((prev) => [...prev, ...newPreviews])
    },
    [existingImages, imageToDelete, images]
  )

  const handleToDeleteList = useCallback((id) => {
    setImageToDelete((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) newSet.delete(id)
      else newSet.add(id)
      return newSet
    })
  }, [])

  const removeNewImage = useCallback(
    (idx) => {
      setImages((prev) => prev.filter((_, index) => index !== idx))

      // 釋放不再使用的 URL 對象
      const urlToRemove = imagePreview[idx]
      if (urlToRemove) {
        URL.revokeObjectURL(urlToRemove)
      }

      setImagePreview((prev) => prev.filter((_, index) => index !== idx))
    },
    [imagePreview]
  )

  //引擎
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      if (rating === 0) {
        toast.warning('請選擇評分')
        return
      }

      //放一包乖乖
      const formData = new FormData()
      formData.append('product_id', product_Id)
      formData.append('user_id', user_id)
      formData.append('rating', rating)
      formData.append('context', reviewText)
      if (reviewID) formData.append('review_id', reviewID)

      images.forEach((image, index) => formData.append('image[]', image))
      formData.append(
        'imageToDelete',
        JSON.stringify(Array.from(imageToDelete))
      )

      try {
        await onSubmit(formData)
        toast.success(reviewID ? '評論已更新' : '評論已送出')
        handleClose()
      } catch (error) {
        toast.error(error.message || '送出失敗，請稍後再試')
      }
    },
    [
      product_Id,
      user_id,
      rating,
      reviewText,
      reviewID,
      images,
      imageToDelete,
      onSubmit,
      handleClose,
    ]
  )


  //img 檔名轉網址
  const existingImages_images = useMemo(
    () => existingImages.map((img) => img.url),
    [existingImages]
  )
  const existingImages_images_withFullUrl = useChrisR2ImageUrlDuo(
    existingImages_images
  )

  return (
    <>
      <button className={clsx(style['editor-btn'])} onClick={handleShow}>
        {edit ? '編輯評論' : '撰寫評論'}
      </button>

      <Modal show={showModal} onHide={handleClose} size="lg" centered dialogClassName="review-modal">
        <Modal.Header closeButton>
          <Modal.Title>{edit ? '編輯評論' : '撰寫評論'}</Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>評論內容</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>評分</Form.Label>
              <div>
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= (hoverRating || rating)
                  return (
                    // TODO 待完善樣式
                    <i
                      key={star}
                      className={clsx(
                        'bx',
                        style['ianStar'],
                        isFilled ? 'bxs-star' : 'bx-star',
                        style.star,
                        isFilled ? style.filled : style.empty
                      )}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      style={{ cursor: 'pointer' }}
                    />
                  )
                })}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>已上傳圖片（點擊圖片可標記刪除）</Form.Label>
              <div className="d-flex gap-2 flex-wrap">
                {existingImages.map(({ id }, index) => {
                  const isDeleted = imageToDelete.has(id)
                  const url = existingImages_images_withFullUrl[index] || ''
                  return (
                    <div
                      key={id}
                      style={{
                        position: 'relative',
                        cursor: 'pointer',
                        opacity: isDeleted ? 0.4 : 1,
                        border: isDeleted
                          ? '2px solid red'
                          : '2px solid transparent',
                        borderRadius: '8px',
                      }}
                      onClick={() => handleToDeleteList(id)}
                      title={isDeleted ? '點擊恢復' : '點擊刪除'}
                    >
                      <img
                        src={url}
                        alt="existing-img"
                        width={80}
                        height={80}
                        style={{ objectFit: 'cover', borderRadius: '8px' }}
                      />
                      {isDeleted && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 2,
                            right: 4,
                            color: 'red',
                            fontWeight: 'bold',
                            fontSize: '18px',
                            userSelect: 'none',
                          }}
                        >
                          ×
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                新增圖片 每位會員最多三張圖片
              </Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
              <div className="d-flex gap-2 mt-2 flex-wrap">
                {/*存在記憶體的圖片預覽，不用擔心網址問題*/}
                {imagePreview.map((src, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <img
                      src={src}
                      alt={`preview-${idx}`}
                      width={80}
                      height={80}
                      style={{ objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      style={{
                        position: 'absolute',
                        top: 2,
                        right: 4,
                        background: 'rgba(255,255,255,0.8)',
                        border: 'none',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        padding: '0 6px',
                        fontWeight: 'bold',
                        fontSize: '14px',
                      }}
                      aria-label="移除圖片"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              取消
            </Button>
            <Button variant="primary" type="submit">
              {edit ? '更新評論' : '提交'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  )
}
