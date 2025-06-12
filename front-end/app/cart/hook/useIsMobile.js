'use client'

//偵測視窗寬度

import { useState, useEffect } from 'react'

export default function UseIsMobile(breakpoint = 992) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    // 初始判斷
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [breakpoint])

  return isMobile
}
