'use client'

import React, { useState, useEffect, useRef } from 'react'

export default function UseDragScroll(sliderRef) {
  //   const sliderRef = useRef(null)
  const state = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
  })

  const handlePointerDown = (e) => {
    const slider = sliderRef.current
    slider.setPointerCapture?.(e.pointerId) // 觸控穩定度++
    state.current.isDown = true
    state.current.startX = e.pageX
    state.current.scrollLeft = slider.scrollLeft
    slider.classList.add('dragging') // 換游標
  }

  const handlePointerMove = (e) => {
    if (!state.current.isDown) return
    e.preventDefault() // 不讓選字 / 拖圖
    const walk = e.pageX - state.current.startX
    sliderRef.current.scrollLeft = state.current.scrollLeft - walk
  }

  const stopDrag = () => {
    state.current.isDown = false
    sliderRef.current.classList.remove('dragging')
  }

  return { handlePointerDown, handlePointerMove, stopDrag }
}
