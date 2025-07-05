import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

// 你有過願望嗎，這邊幫你實現：
// 依照hook規則放在頁首來宣告引入（抓你要的功能就行了
// 先引入 import { } @/hook/use-wish.js
// const { data: favorites, isLoading } = useWish(token)
// const addFavorite = useAddWish(token)
// const deleteFavorite = useDeleteWish(token)

// 新增收藏
export const useAddWish = (token) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ courses_id, courses_experience_id, product_id }) => {
      const ids = [courses_id, courses_experience_id, product_id].filter(
        Boolean
      )
      if (ids.length !== 1) throw new Error('請傳入一種收藏類型的 ID')

      const res = await axios.post(
        'http://localhost:3005/api/wish-list',
        { courses_id, courses_experience_id, product_id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}

// 讀取收藏列表
export const useWish = (token) => {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3005/api/wish-list', {
        headers: { Authorization: `Bearer ${token}` },
      })
      return res.data.data
    },
    enabled: !!token, // 有 token 才執行
  })
}

// 刪除收藏
export const useDeleteWish = (token) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ courses_id, courses_experience_id, product_id }) => {
      const ids = [courses_id, courses_experience_id, product_id].filter(
        Boolean
      )
      if (ids.length !== 1) throw new Error('請傳入一種收藏類型的 ID')

      const res = await axios.delete('http://localhost:3005/api/wish-list', {
        data: { courses_id, courses_experience_id, product_id },
        headers: { Authorization: `Bearer ${token}` },
      })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
  })
}
