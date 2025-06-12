'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const FILTER_CACHE = 'product_filters'

const defaultFilters = {
  keyword: '',
  brandIds: [],
  tagIds: [],
  categoryIds: [],
  minRating: 0,
  maxRating: 5,
  minPrice: 0,
  maxPrice: 9999,
  onSaleOnly: false,
  selectedPriceRangeKeys: [],
  sortBy: '',
  sortOrder: 'ASC',
}

export default function useFilterCacheAndGetUrl() {
  const router = useRouter()
  const [filters, setFiltersState] = useState(defaultFilters)
  const [isInitialized, setIsInitialized] = useState(false)

  // 工具函數：清理陣列數據
  const cleanArray = useCallback((arr) => {
    if (!Array.isArray(arr)) return []
    return [...new Set(arr.map(v => String(v)).filter(Boolean))]
  }, [])

  // 工具函數：從 URL 解析 filters
  const parseFromURL = useCallback(() => {
    if (typeof window === 'undefined') return {}

    const params = new URLSearchParams(window.location.search)
    const result = {}

    // 處理字符串字段
    const stringFields = ['keyword', 'sortBy', 'sortOrder']
    stringFields.forEach(field => {
      const value = params.get(field)
      if (value) result[field] = value
    })

    // 處理數字字段
    const numberFields = ['minRating', 'maxRating', 'minPrice', 'maxPrice']
    numberFields.forEach(field => {
      const value = params.get(field)
      if (value && !isNaN(Number(value))) {
        result[field] = Number(value)
      }
    })

    // 處理布爾字段
    if (params.get('onSaleOnly') === 'true') {
      result.onSaleOnly = true
    }

    // 處理陣列字段
    const arrayFields = ['brandIds', 'tagIds', 'categoryIds', 'selectedPriceRangeKeys']
    arrayFields.forEach(field => {
      const value = params.get(field)
      if (value) {
        result[field] = cleanArray(value.split(','))
      }
    })

    console.log('🔍 從 URL 解析:', result)
    return result
  }, [cleanArray])

  // 工具函數：從 localStorage 解析 filters
  const parseFromCache = useCallback(() => {
    if (typeof window === 'undefined') return {}

    try {
      const cached = localStorage.getItem(FILTER_CACHE)
      if (!cached) return {}

      const parsed = JSON.parse(cached)
      console.log('💾 從 localStorage 解析:', parsed)
      return parsed
    } catch (error) {
      console.error('localStorage 解析失敗:', error)
      return {}
    }
  }, [])

  // 工具函數：更新 URL
  const updateURL = useCallback((newFilters) => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams()

    Object.entries(newFilters).forEach(([key, value]) => {
      // 跳過預設值
      if (JSON.stringify(value) === JSON.stringify(defaultFilters[key])) {
        return
      }

      if (Array.isArray(value) && value.length > 0) {
        params.set(key, value.join(','))
      } else if (value !== '' && value !== null && value !== undefined) {
        params.set(key, String(value))
      }
    })

    const newSearch = params.toString()
    const currentSearch = window.location.search.substring(1)

    if (newSearch !== currentSearch) {
      const newURL = newSearch ? `?${newSearch}` : window.location.pathname
      console.log('🔄 更新 URL:', newURL)
      router.replace(newURL, { scroll: false })
    }
  }, [router])

  // 工具函數：更新 localStorage
  const updateCache = useCallback((newFilters) => {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(FILTER_CACHE, JSON.stringify(newFilters))
      console.log('💾 更新 localStorage 成功')
    } catch (error) {
      console.error('💾 更新 localStorage 失敗:', error)
    }
  }, [])

  // 初始化
  useEffect(() => {
    if (typeof window === 'undefined') return

    console.log('🚀 開始初始化 filters...')

    const fromURL = parseFromURL()
    const fromCache = parseFromCache()

    // 合併數據 (URL 優先)
    const merged = {
      ...defaultFilters,
      ...fromCache,
      ...fromURL,
    }

    // 清理陣列字段
    const arrayFields = ['brandIds', 'tagIds', 'categoryIds', 'selectedPriceRangeKeys']
    arrayFields.forEach(field => {
      if (merged[field]) {
        merged[field] = cleanArray(merged[field])
      }
    })

    console.log('🔀 合併後的 filters:', merged)

    setFiltersState(merged)
    setIsInitialized(true)

    console.log('✅ 初始化完成')
  }, [parseFromURL, parseFromCache, cleanArray])

  // 當 filters 變化時更新 URL 和 localStorage
  useEffect(() => {
    if (!isInitialized) return

    console.log('🔄 filters 已更新:', filters)

    updateURL(filters)
    updateCache(filters)
  }, [filters, isInitialized, updateURL, updateCache])

  // 更新 filters 的函數
  const setFilters = useCallback((update) => {
    console.log('🎯 請求更新 filters:', update)

    setFiltersState(prev => {
      const newFilters = { ...prev }

      // 處理更新
      Object.entries(update).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          newFilters[key] = cleanArray(value)
        } else {
          newFilters[key] = value
        }
      })

      console.log('📝 更新前:', prev)
      console.log('📝 更新後:', newFilters)

      return newFilters
    })
  }, [cleanArray])

  // 重置 filters
  const resetFilters = useCallback(() => {
    console.log('🔄 重置 filters')
    setFiltersState(defaultFilters)
  }, [])

  return {
    filters,
    setFilters,
    resetFilters,
    isInitialized
  }
}