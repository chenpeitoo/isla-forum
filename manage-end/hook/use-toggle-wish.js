import { useQueryClient } from '@tanstack/react-query'
import { useWish, useAddWish, useDeleteWish } from './use-wish.js'
import { toast } from 'react-toastify'

// 範例：
//type 支援值：
// 'product'
// 'courses'
// 'courses_experience'
// 會自動對應欄位名稱：product_id、courses_id、courses_experience_id
//
//function FavoriteButton({ token, type = 'product', id }) {
//   const { isFavorited, toggleFavorite } = useToggleFavorite(token, type, id)
//
//   return (
//     <button onClick={toggleFavorite}>
//       {isFavorited ? '已收藏' : '加入收藏'}
//     </button>
//   )
// }

export const useToggleWish = (token, type, id) => {
  const queryClient = useQueryClient()

  const { data: favorites = [] } = useWish(token)
  const addFavorite = useAddWish(token)
  const deleteFavorite = useDeleteWish(token)

  const isFavorited = favorites.some((fav) => fav[`${type}_id`] === id)

  const toggleFavorite = () => {
    if (!token) {
      toast.error('請先登入')
      return
    }

    const payload = {
      [`${type}_id`]: id,
    }

    if (isFavorited) {
      deleteFavorite.mutate(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries(['wishlist'])
          toast.success('已從願望清單移除', )
        },
        onError: (err) => {
          toast.error('移除失敗：' + err.message)
        },
      })
    } else {
      addFavorite.mutate(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries(['wishlist'])
          toast.success('已加入願望清單', )
        },
        onError: (err) => {
          toast.error('加入失敗：' + err.message)
        },
      })
    }
  }

  return {
    isFavorited,
    toggleFavorite,
  }
}
