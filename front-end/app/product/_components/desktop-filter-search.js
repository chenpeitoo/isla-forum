'use client'
import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useCombobox } from 'downshift'
import { BsSearch, BsX } from 'react-icons/bs'
import _debounce from 'lodash/debounce' // 引入 debounce 函式

// 假設這是你的 API 端點
const API_ENDPOINT = '/api/search-items' // 請替換成你實際的 API 端點

function SidebarFilterSearch() {
  const [inputItems, setInputItems] = useState([]) // 初始建議為空
  const [isLoading, setIsLoading] = useState(false) // 載入狀態
  const [error, setError] = useState(null) // 錯誤狀態

  // 用於 AbortController 取消 API 請求
  const abortControllerRef = useRef(null)

  const fetchItems = async (inputValue) => {
    if (!inputValue || inputValue.trim() === '') {
      setInputItems([]) // 如果輸入為空，清空建議
      setIsLoading(false)
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    // 取消上一次的請求 (如果有的話)
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    // 建立新的 AbortController
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    try {
      const response = await fetch(
        `${API_ENDPOINT}?q=${encodeURIComponent(inputValue)}`,
        {
          signal, // 將 signal 傳遞給 fetch
        }
      )

      if (signal.aborted) {
        // 如果請求已被取消，則不執行任何操作
        console.log('API request aborted')
        return
      }

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      // 假設 API 回傳的資料結構是 { results: [{ id: '1', name: 'Item 1' }, ...] }
      // 或者直接是 [{ id: '1', name: 'Item 1' }, ...]
      // 你需要根據實際 API 回應調整這裡
      setInputItems(data.results || data || [])
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Fetch aborted successfully')
      } else {
        console.error('Failed to fetch items:', err)
        setError('無法載入建議項目，請稍後再試。')
        setInputItems([]) // 發生錯誤時清空建議
      }
    } finally {
      // 只有在請求未被取消時才設定 isLoading 為 false
      if (!signal.aborted) {
        setIsLoading(false)
      }
    }
  }

  // 使用 useCallback 和 debounce 來優化 API 呼叫
  // 延遲 300 毫秒後執行 fetchItems
  const debouncedFetchItems = useCallback(_debounce(fetchItems, 300), [])

  const {
    isOpen,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
    reset,
    setInputValue, // 新增，方便在選擇後更新輸入框
  } = useCombobox({
    items: inputItems,
    itemToString: (item) => (item ? item.name : ''),
    // 當輸入框內容改變時，呼叫 debouncedFetchItems
    onInputValueChange: ({ inputValue }) => {
      debouncedFetchItems(inputValue)
    },
    onSelectedItemChange: ({ selectedItem: newSelectedItem }) => {
      console.log('選擇的項目:', newSelectedItem)
      if (newSelectedItem) {
        // 選擇項目後的行為，例如：
        // 1. 可以將選擇的項目名稱填回輸入框 (如果 Downshift 沒有自動處理好)
        // setInputValue(newSelectedItem.name);
        // 2. 觸發搜尋或導航
        alert(`你選擇了：${newSelectedItem.name}`)
        // 3. 清空建議列表 (如果需要)
        // setInputItems([]);
      }
    },
    id: 'sidebar-filter-search-api-combobox',
  })

  // 元件卸載時取消任何正在進行的 API 請求
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const handleClearClick = () => {
    reset() // 重設 Downshift 狀態
    setInputItems([]) // 清空建議列表
    setError(null) // 清除錯誤訊息
    if (abortControllerRef.current) {
      // 取消可能的 API 請求
      abortControllerRef.current.abort()
    }
  }

  return (
    <div {...getComboboxProps()} className="w-100 position-relative">
      {/* <label {...getLabelProps()} className="visually-hidden">搜尋</label> */}
      <div className="sidebar-filter-search-box d-flex justify-content-center align-items-center flex-row w-100 px-3 gap-3">
        <BsSearch className="sidebar-filter-search-icon d-flex" />
        <div className="sidebar-filter-search-input w-100">
          <input
            className="w-100 sidebar-filter-search"
            type="text"
            placeholder="你想要找什麼呢？"
            {...getInputProps()}
          />
        </div>
        <a
          href="#"
          className="list-unstyled text-black"
          onClick={(e) => {
            e.preventDefault()
            handleClearClick()
          }}
          aria-label="清除搜尋內容"
        >
          <BsX className="sidebar-filter-search-x-icon" />
        </a>
      </div>

      <ul
        {...getMenuProps()}
        className="list-unstyled position-absolute bg-white border mt-1 w-100 shadow-sm"
        style={{ zIndex: 1000 }}
      >
        {isOpen && (
          <>
            {isLoading && (
              <li className="px-3 py-2 text-muted">正在載入中...</li>
            )}
            {error && <li className="px-3 py-2 text-danger">{error}</li>}
            {!isLoading && !error && inputItems.length === 0 && (
              <li className="px-3 py-2 text-muted">
                沒有找到結果，或請輸入關鍵字
              </li>
            )}
            {!isLoading &&
              !error &&
              inputItems.map((item, index) => (
                <li
                  key={item.id || index} // 確保有 key，如果 item.id 可能不存在，則用 index
                  {...getItemProps({ item, index })}
                  className="px-3 py-2"
                  style={{
                    backgroundColor:
                      highlightedIndex === index ? '#e9ecef' : 'white',
                    fontWeight: selectedItem === item ? 'bold' : 'normal',
                    cursor: 'pointer',
                  }}
                >
                  {item.name} {/* 假設 item 有 name 屬性 */}
                </li>
              ))}
          </>
        )}
      </ul>
    </div>
  )
}

export default SidebarFilterSearch
