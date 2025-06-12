import { useState, useEffect } from 'react'

// 這是一個根據螢幕大小選擇渲染元件的 Hook
function useMobileDisplay(query) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)

    const updateMatches = () => {
      setMatches(media.matches)
    }

    updateMatches() // 初始檢查

    const listener = () => updateMatches()

    try {
      media.addEventListener('change', listener)
    } catch (e) {
      try {
        media.addListener(listener) // fallback
      } catch (e) {
        console.error('addListener failed', e)
      }
    }

    return () => {
      try {
        media.removeEventListener('change', listener)
      } catch (e) {
        try {
          media.removeListener(listener) // fallback
        } catch (e) {
          console.error('removeListener failed', e)
        }
      }
    }
  }, [query])

  return matches
}

export default useMobileDisplay
