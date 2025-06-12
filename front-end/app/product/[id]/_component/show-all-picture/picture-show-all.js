'use client'

import { useState } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

export default function PictureShowAll({ reviewImages = [] }) {
  const [open, setOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleOpen = (index) => {
    setCurrentIndex(index)
    setOpen(true)
  }

  return (
    <>
      <div className="comment-sidebar-photos-box">
        <div className="comment-sidebar-photos-title">所有圖片</div>
        <div className="comment-sidebar-photos">
          {reviewImages.slice(0, 6).map(({ imageUrl }, i) => (
            <button
              key={i}
              className="comment-img"
              type="button"
              onClick={() => handleOpen(i)}
            >
              <Image
                className="img-fluid"
                src={imageUrl}
                alt={`評論圖片 ${i + 1}`}
                width={0}
                height={0}
                sizes="100px"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </button>
          ))}
        </div>

        <button
          className="comment-sidebar-photos-show-more"
          type="button"
          onClick={() => handleOpen(0)}
        >
          查看全部
        </button>
      </div>

      {/* Lightbox 顯示區 */}
      {open && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={currentIndex}
          slides={reviewImages.map(({ imageUrl }) => ({
            src: imageUrl,
          }))}
        />
      )}
    </>
  )
}
