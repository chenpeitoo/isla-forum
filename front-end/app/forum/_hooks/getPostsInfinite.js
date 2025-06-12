import useSWRInfinite from 'swr/infinite'

const PAGE_SIZE = 3
const fetcher = (url) => fetch(url).then((res) => res.json())

export default function GetPostsInfinite(params) {
  // http://localhost:3005/api/forum/posts/home?page=1&limit=3
  const getKey = (pageIndex, previousPageData) =>
    // 如果上一頁回傳 data 陣列長度為 0，就停止往下抓
    previousPageData && previousPageData.data.length === 0
      ? null
      : params
        ? `http://localhost:3005/api/forum/posts/home?${params}&page=${pageIndex + 1}&limit=${PAGE_SIZE}`
        : `http://localhost:3005/api/forum/posts/home?page=${pageIndex + 1}&limit=${PAGE_SIZE}`

  const { data, size, setSize, isLoading, mutate, error } = useSWRInfinite(
    getKey,
    fetcher
  )

  // 把每一頁的 page.data 拿出來，然後攤平成一個 array
  const posts = data ? data.map((page) => page.data).flat() : []

  // 判斷最後一頁的資料長度是否有滿 PAGE_SIZE，用來決定是否還有更多
  const hasMore = data ? data[data.length - 1].data.length === PAGE_SIZE : true

  return {
    posts,
    loadMore: () => setSize(size + 1),
    hasMore,
    isLoading,
    mutate,
    error,
  }
}
