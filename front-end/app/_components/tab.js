'use client'
import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import './tab.css'
import { useSearchParams } from 'next/navigation'

export default function Componentstab({
  cates = [], // tab 項目陣列，每個元素為顯示文字
  height = 60, // 容器高度（數字，單位為 px）
  handleTabChange = () => {}, // tab 切換後觸發的 callback，參數為 tab 編號（從 1 開始）
  // 註： cates的編號為索引值+1，方便用?判斷是否賦值（因為0為falsy），也方便對應sql資料表的id欄位編號
}) {
  // >>>>>>>使用方式：點擊tab觸發自己的cb function，參數為tab的編號（從1開始）<<<<<<<<
  // 點擊後跳轉頁面，再透過抓取路由查詢參數重新fetch、完成篩選
  // const handleTabChange = (tabNumber) => {
  //   const currentParams = new URLSearchParams(params)
  //   currentParams.append('tab', tabNumber)
  //   router.push(`http://localhost:3000/forum?${currentParams.toString()}`)
  // }
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

  const searchParams = useSearchParams()
  const tabParam = useMemo(
    () => Number(searchParams.get('tab') ?? 1),
    [searchParams]
  )
  const [activeIndex, setActiveIndex] = useState(
    () => parseInt(tabParam, 10) - 1
  )
  const containerRef = useRef(null)
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 })
  const [enableTransition, setEnableTransition] = useState(false) //載入時無動畫

  // 讓首尾底線的漸層在不同邊
  const edgeClass =
    activeIndex === 0 ? 'start' : activeIndex === cates.length - 1 ? 'end' : ''

  // 功能：將underline移到點擊的按鈕下方
  const updateUnderline = useCallback((index) => {
    const btn = containerRef.current?.children[index]
    if (btn) {
      setUnderlineStyle({
        left: btn.offsetLeft,
        width: btn.offsetWidth,
      })
    }
  }, [])

  // 首次載入就定位，並開啟 transition
  useEffect(() => {
    updateUnderline(activeIndex)
  }, [activeIndex, updateUnderline])

  useEffect(() => {
    let resizeTimer
    const handleResize = () => {
      setEnableTransition(false)
      updateUnderline(activeIndex)
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        setEnableTransition(true)
      }, 100)
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimer)
    }
  }, [activeIndex, updateUnderline])

  useEffect(() => {
    // setEnableTransition(true)
    const timer = setTimeout(() => setEnableTransition(true), 0)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className="tab-container position-relative"
      style={{ width: '100%', height: `${height}px` }}
    >
      <div className="tab-set w-100 h-100 d-flex" ref={containerRef}>
        {cates.map((cat, i) => (
          <button
            key={i}
            className={`btn btn-link flex-fill text-decoration-none fw-medium text-nowrap ${
              i === activeIndex ? 'text-primary' : 'subtext'
            }`}
            role="tab"
            aria-selected={i === activeIndex}
            onClick={() => {
              setActiveIndex(i)
              updateUnderline(i)
              handleTabChange(i + 1) //帶入值從1開始
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 底線 */}
      <div
        className={`category-underline ${edgeClass} ${enableTransition ? '' : 'no-transition'}`}
        style={{
          left: underlineStyle.left,
          width: underlineStyle.width,
        }}
      />
    </div>
  )
}
