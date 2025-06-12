'use client'

import { useEffect, useState } from 'react'
import Lottie from 'lottie-react'
import Image from 'next/image'
import leafData from './_components/leaf-logo.json'
import './splash.css'

export default function HomeAnimationSplash({ onFinish }) {
  const [stage, setStage] = useState('leaf')
  const [visibleIndex, setVisibleIndex] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage('fadeout'), 2500),
      setTimeout(() => setStage('image'), 3500),
      setTimeout(() => onFinish(), 6000),
    ]
    return () => timers.forEach(clearTimeout)
  }, [onFinish])

  useEffect(() => {
    if (stage === 'leaf' || stage === 'fadeout') {
      const interval = setInterval(() => {
        setVisibleIndex((prev) => (prev < 4 ? prev + 1 : prev))
      }, 400)
      return () => clearInterval(interval)
    }
  }, [stage])

  const letters = ['自', '然', '之', '島']

  return (
    <div className="splash-container">
      {(stage === 'leaf' || stage === 'fadeout') && (
        <div className="step1-wrapper">
          <Lottie
            animationData={leafData}
            loop={false}
            className={`leaf-animation ${stage === 'fadeout' ? 'fade-out' : ''}`}
          />
          <div className={`isla-text ${stage === 'fadeout' ? 'fade-out' : ''}`}>
            {letters.map((char, i) => (
              <span
                key={i}
                className={`isla-letter ${visibleIndex > i ? 'visible' : ''}`}
              >
                {char}
              </span>
            ))}
          </div>
        </div>
      )}

      {stage === 'image' && (
        <div className="logo-wrapper">
          <div className="logo-stack show">
            <Image
              src="/images/coupon/isla-home.png"
              width={250}
              height={250}
              alt="ISLA logo"
              className="isla-pic"
            />
            <Image
              src="/images/coupon/beauty.png"
              width={150}
              height={150}
              alt="BEAUTY logo"
              className="beauty-pic"
            />
          </div>
        </div>
      )}
    </div>
  )
}
