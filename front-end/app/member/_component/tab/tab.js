'use client'
import React, { useRef, useState, useLayoutEffect, useEffect } from 'react'
import './tab.css'
import { useRouter, useSearchParams } from 'next/navigation'

// 註： cate值為索引值+1，方便用?判斷是否賦值（因為0為falsy），也方便對應資料表的類別id
// 如： tab ? new URLSearchParams().append('tab', tab) : ''
export default function Componentstab({
  cates = [], //tab項目文字
  height = 60, // 預設高度，直接用數字
  handleTabChange = () => {}, //帶入值為tab的編號（如下）
}) {
  // >>>>>>>使用方式：在自己的引入頁面中設置cb，帶入tab編號<<<<<<<<
  // 點擊後跳轉頁面，再透過抓取路由查詢參數重新fetch、完成篩選
  // const handleTabChange = (newTab) => {
  //   const currentParams = new URLSearchParams(params)
  //   currentParams.append('tab', newTab)
  //   router.push(`http://localhost:3000/forum?${currentParams.toString()}`)
  // }
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

  // const router = useRouter()
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef(null)
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 })
  // const [enableTransition, setEnableTransition] = useState(false)

  // 把更新 underline 的邏輯抽成函式
  const updateUnderline = (index) => {
    const btn = containerRef.current?.children[index]
    if (btn) {
      setUnderlineStyle({
        left: btn.offsetLeft,
        width: btn.offsetWidth,
      })
    }
  }

  const tabParam = useSearchParams().get('tab')
  console.log(tabParam)

  // 首次載入就定位，並開啟 transition
  // useLayoutEffect(() => {
  // updateUnderline()
  // 下一個 tick 才啟用動畫，避免一進來就看到位移動畫
  // setTimeout(() => setEnableTransition(true), 0)
  // setTimeout(() => console.log('setTimeout'), 0)
  // }, []) // 只跑一次

  // activeIndex 或容器 ref 換了就重新計算位置
  useEffect(() => {
    // if (!enableTransition) return
    updateUnderline(activeIndex)
    console.log(underlineStyle)
  }, [activeIndex])

  // // 監聽 resize，並在元件卸載時移除 listener
  // useEffect(() => {
  //   // if (!enableTransition) return
  //   const handleResize = () => {
  //     updateUnderline()
  //   }
  //   window.addEventListener('resize', handleResize)
  //   return () => window.removeEventListener('resize', handleResize)
  // }, [activeIndex])

  // 可選：依據邊界，切換不同 class（如果你 CSS 有定義 start/end 樣式）
  const edgeClass =
    activeIndex === 0 ? 'start' : activeIndex === cates.length - 1 ? 'end' : ''

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
            onClick={() => {
              setActiveIndex(i)
              updateUnderline(i)
              // setTab(i + 1)
              // mutate()
              handleTabChange(i + 1) //帶入值為1 ~ items.length
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 這條底線 */}
      <div
        className={`category-underline ${edgeClass} ${'with-transition'}`}
        style={{
          left: underlineStyle.left,
          width: underlineStyle.width,
        }}
      />
    </div>
  )
}
