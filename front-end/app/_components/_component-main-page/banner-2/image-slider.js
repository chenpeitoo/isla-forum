import React, { useEffect, useState } from 'react'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'
// import { FaAngleLeft, FaAngleRight } from 'lucide-react'
import Image from 'next/image'
import Swiper from 'swiper'
import './_style/banner.css'

const images = [
  'https://source.unsplash.com/random/800x400?nature',
  'https://source.unsplash.com/random/800x400?city',
  'https://source.unsplash.com/random/800x400?technology',
  'https://source.unsplash.com/random/800x400?ocean',
]

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  useEffect(() => {
    const interval = setInterval(nextSlide, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="position-relative w-100 mx-auto overflow-hidden rounded-2xl shadow-lg banner-container">
      <Image
        src={images[currentIndex]}
        alt={`Slide ${currentIndex}`}
        width={1440}
        height={680}
        className="w-100 h-64 object-cover transition-opacity duration-700 ease-in-out"
      />

      {/* 左箭頭 */}
      <button onClick={prevSlide} className="position-absolute mp-left-arrow">
        <FaAngleLeft />
      </button>

      {/* 右箭頭 */}
      <button onClick={nextSlide} className="position-absolute mp-right-arrow">
        <FaAngleRight />
      </button>

      {/* 底部指示點 */}
      <div className="position-absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
