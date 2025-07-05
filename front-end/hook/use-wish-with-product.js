import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

export const useWishProduct = (token) => {
  const query = useQuery({
    queryKey: ['wishlist-product'],
    queryFn: async () => {
      const res = await axios.get(
        'http://localhost:3005/api/wish-list/products',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      return res.data.data
    },
    enabled: !!token,
  })

  return {
    ...query,
    refetch: query.refetch,
  }
}
