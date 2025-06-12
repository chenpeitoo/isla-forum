import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import style from './product-picture-show.module.css'
import clsx from 'clsx'

export default function ProductPictureShow({ images }) {
  // images 是圖片 URL 陣列，至少一張
  const [selectedIndex, setSelectedIndex] = useState(0)
  useEffect(() => {
    console.log('ProductPictureShow rendered')
  })

  return (
    <div className={clsx(style['main'])}>
      <div className="pic-bar d-flex align-items-center gap-3">
        {/*沒時間修爆版，強制只顯示五個圖片*/}
        {images.slice(0, 5).map((imgUrl, idx) => (
          <Image
            key={idx}
            className="pic-bar-item"
            src={imgUrl}
            alt={`產品圖片縮圖 ${idx + 1}`}
            width={0}
            height={0}
            style={{
              width: '60px',
              height: '60px',
              objectFit: 'cover',
              border:
                idx === selectedIndex ? '2px solid #fd7061' : '1px solid #ccc',
              borderRadius: '4px',
            }}
            onClick={() => setSelectedIndex(idx)}
          />
        ))}
      </div>
      <div className="pic-show">
        <Image
          className="pic-show-item"
          src={images[selectedIndex]}
          alt="主要產品圖片"
          width={0}
          height={0}
        />
      </div>
    </div>
  )
}
