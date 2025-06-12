// ✅ review-modal.js
'use client'

import { useState, useMemo } from 'react'
import ReviewCard from '../review-card/review-card'
import './review-modal.css'
import { useAuth } from '@/hook/use-auth'
import { toast } from 'react-toastify'
import EditReviewModal from '../edit-review-modal/edit-review-modal'
import CommentsCard from '../comments-card/comments-card'

export default function ReviewModal({
  isOpen,
  onClose,
  reviewCard = [],
  likesMap = {},
  toggleLike = () => {},
  onAfterDelete = () => {},
  onUpdate = () => {},
  onEdit = () => {},
  sortOption = 1,
  setSortOption = () => {},
  highlightedId = null,
  // highlightedCommentId = 0,
}) {
  const { user } = useAuth()
  const token = user?.token || ''
  const [editingComment, setEditingComment] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleEditComment = (comment) => {
    setEditingComment(comment)
    setIsEditModalOpen(true) // ✅ 要打開 Modal
  }
  // ⭐ 留言更新後立即反映畫面
  const handleCommentUpdate = (id, newContent, newStar) => {
    // 呼叫父層 onUpdate 函式就好，由父層更新 reviewCard
    onUpdate(id, newContent, newStar)
  }

  const handleDelete = async (commentId) => {
    if (!window.confirm('確定要刪除這則留言嗎？')) return

    try {
      const res = await fetch(
        `http://localhost:3005/api/course/comments/${commentId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const data = await res.json()
      if (data.status === 'success') {
        toast.success('留言已刪除')
        onAfterDelete(commentId)
      } else {
        toast.error(data.message || '刪除失敗')
      }
    } catch (err) {
      toast.error('刪除過程出錯')
      console.error(err)
    }
  }

  const avgStar = useMemo(() => {
    if (reviewCard.length === 0) return 0
    const sum = reviewCard.reduce((acc, cur) => acc + Number(cur.star || 0), 0)
    return (sum / reviewCard.length).toFixed(1)
  }, [reviewCard])

  const renderStars = (score) => {
    const ratingNum = Number(score)
    const fullStars = Math.floor(ratingNum)
    const halfStar = ratingNum % 1 >= 0.5
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <i className="bx bxs-star" key={`full-${i}`} />
        ))}
        {halfStar && <i className="bx bxs-star-half" key="half" />}
        {[...Array(emptyStars)].map((_, i) => (
          <i className="bx bx-star" key={`empty-${i}`} />
        ))}
      </>
    )
  }

  if (!isOpen) return null

  return (
    <>
      <div className="custom-modal" style={{ display: 'flex' }}>
        <div className="custom-modal-content">
          <div className="modal-header">
            <h5 className="window-title">所有評價</h5>
            <button onClick={onClose} className="btn-close-custom">
              ×
            </button>
          </div>
          <div className="modal-body">
            <div className="row m-0 justify-content-between ali">
              <div className="d-flex my-2 mb-4 col-9 p-0 align-items-center">
                <div className="pe-2 card-score-course box5-comment-h1-1">
                  {avgStar}
                </div>
                <div className="box5-comment-p pe-3">/ 5.0</div>
                <div className="pe-3 box5-comment-h1-1">
                  {renderStars(avgStar)}
                </div>
                <div className="d-flex">
                  <div className="card-people-course box5-comment-p align-content-center">
                    {reviewCard.length} 則評價
                  </div>
                </div>
              </div>
              {!editingComment && (
                <div className="row col-3 h-25 my-2 mb-4">
                  <select
                    className="form-select no-border"
                    value={sortOption}
                    onChange={(e) => setSortOption(Number(e.target.value))}
                  >
                    <option value={1}>最有幫助</option>
                    <option value={2}>評價最高</option>
                    <option value={3}>評價最低</option>
                    <option value={4}>日期最新</option>
                    <option value={5}>日期最舊</option>
                  </select>
                </div>
              )}
            </div>

            {/* ✅ 渲染 reviewCard（已排序） */}
            {reviewCard.map((v) => (
              <ReviewCard
                key={v.comment_id}
                member_id={v.member_id}
                member_name={v.member_name}
                star={v.star}
                created={v.created}
                content={v.content}
                ava_url={v.ava_url}
                comment_id={v.comment_id}
                likeData={likesMap[v.comment_id] || { liked: false, count: 0 }}
                onToggleLike={toggleLike}
                onEdit={() => handleEditComment(v)}
                onDelete={() => handleDelete(v.comment_id)}
                isEditing={editingComment?.comment_id === v.comment_id}
                editingContent={editingComment?.content || ''}
                editingStar={editingComment?.star || 0}
                onEditChange={(field, value) => {
                  setEditingComment((prev) => ({ ...prev, [field]: value }))
                }}
                highlighted={v.comment_id === highlightedId}
                onEditCancel={() => setEditingComment(null)}
                onEditSave={async () => {
                  try {
                    const res = await fetch(
                      `http://localhost:3005/api/course/comments/${editingComment.comment_id}`,
                      {
                        method: 'PATCH',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          content: editingComment.content,
                          star: editingComment.star,
                        }),
                      }
                    )
                    const result = await res.json()
                    if (result.status === 'success') {
                      toast.success('留言已更新')
                      onUpdate(
                        editingComment.comment_id,
                        editingComment.content,
                        editingComment.star
                      )
                      setEditingComment(null)
                    } else {
                      toast.error(result.message || '更新失敗')
                    }
                  } catch (err) {
                    toast.error('更新出錯')
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div
        className={`modal-backdrop${isOpen ? ' show' : ''}`}
        onClick={onClose}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onClose()
        }}
      />
      <EditReviewModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        comment={editingComment}
        onUpdate={handleCommentUpdate}
        // highlightedId={highlightedCommentId}
      />
    </>
  )
}
