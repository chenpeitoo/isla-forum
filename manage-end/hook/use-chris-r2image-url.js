import { useState, useEffect } from 'react'

// 這邊可以幫助你抓到躲在R2伺服器的小im雞，只需要提供資料庫裡的url
// Duo用法：
// const filenames = imageData.map(img => img.url)
// const fullUrls = useChrisR2ImageUrlDuo(filenames)

const chris_r2_url = 'https://isla-image.chris142852145.workers.dev/'

export function getChrisR2ImageUrl(filename) {
  if (!filename) return null
  return chris_r2_url + filename
}

export function useChrisR2ImageUrlDuo(filenames = []) {
  const [urls, setUrls] = useState([])

  useEffect(() => {
    if (!Array.isArray(filenames) || filenames.length === 0) {
      setUrls([])
      return
    }
    const newUrls = filenames.map((url) => chris_r2_url + url)
    setUrls(newUrls)
  }, [filenames])

  return urls
}
