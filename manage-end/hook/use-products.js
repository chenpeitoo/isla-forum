import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query'
import axios from 'axios'
import qs from 'qs'
import { isValid, format } from 'date-fns'
//這是取得所有商品資料的函式
//範例： const { products, productsLoading, productsError, brands, categories, tags } = useProducts(filters)
//可參考商品列表的使用來參考

//const { brandProducts, isLoading, error } = useBrandProducts({
//   brandIds: [1, 3],
//   limit: 12,
// })

const fetchProductDetail = async (id) => {
  const res = await axios.get(`http://localhost:3005/api/product/edit/${id}`)
  if (res.status !== 200 || res.data?.success !== true || !res.data?.data) {
    throw new Error('資料庫查無商品資料')
  }
  return res.data.data
}

export const updateProduct = async (productData) => {
  const { product_id } = productData

  if (!product_id) {
    throw new Error('呼叫 API 時缺少 product_id')
  }

  try {
    const res = await axios.put(
      `http://localhost:3005/api/product/edit/${product_id}`,
      productData
    )

    // 即使 status 是 200，後端也可能回傳 { success: false }
    if (res.data?.success === false) {
      throw new Error(res.data?.message || '商品更新失敗')
    }

    // 成功時，回傳後端給的資料
    return res.data
  } catch (error) {
    // 當 axios 請求失敗 (如 4xx, 5xx 錯誤) 或發生其他錯誤時
    // 從 axios 的 error 物件中提取更詳細的錯誤訊息
    const errorMessage =
      error.response?.data?.message || error.message || '發生未知的網路錯誤'

    // 將錯誤再次拋出，讓 React Query 的 onError 回呼可以接收到
    throw new Error(errorMessage)
  }
}

export const useBrandProducts = ({
  brandIds = [],
  limit = 10,
  categoryIds = [],
  tagIds = [],
  minRating = 0,
  maxRating = 5,
  minPrice = 0,
  maxPrice = 9999,
} = {}) => {
  const parsedFilters = {
    brandIds: brandIds.map((id) => Number(id)).filter((id) => !isNaN(id)),
    categoryIds: categoryIds.map((id) => Number(id)).filter((id) => !isNaN(id)),
    tagIds: tagIds.map((id) => Number(id)).filter((id) => !isNaN(id)),
    minRating: Number(minRating) || 0,
    maxRating: Number(maxRating) || 5,
    minPrice: Number(minPrice) || 0,
    maxPrice: Number(maxPrice) || 9999,
    limit: Number(limit) || 10,
    offset: 0,
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['brand-products', parsedFilters],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3005/api/products', {
        params: parsedFilters,
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: 'brackets' }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (res.status !== 200 || res.data.status !== 'success') {
        throw new Error('Failed to fetch brand products')
      }

      return res.data.data
    },
    enabled: parsedFilters.brandIds.length > 0, // 僅當品牌 ID 有指定時才執行查詢
    staleTime: 1000 * 60 * 5,
  })

  return {
    brandProducts: data || [],
    isLoading,
    error,
  }
}

const formatDateString = (date) =>
  date && isValid(new Date(date)) ? format(new Date(date), 'yyyy-MM-dd') : null

export const UseProductEditDetail = (id) => {
  const queryClient = useQueryClient()

  const { data, isLoading, error, isError, isFetching } = useQuery({
    queryKey: ['product-edit', id],
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
    queryFn: () => fetchProductDetail(id),
  })

  return {
    products: data,
    loading: isLoading || isFetching,
    error,
  }
}

export const UseProductReviews = (id) => {
  return useQuery({
    queryKey: ['product-reviews', id],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:3005/api/product-reviews/${id}`
      )
      if (res.status !== 200 || res.data.success !== true) {
        throw new Error('Failed to fetch product reviews')
      }
      return res.data.data
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 600,
  })
}

//userID
export const UseUserReview = (product_id, user_id) => {
  return useQuery({
    queryKey: ['product-reviews', product_id, user_id],
    queryFn: async () => {
      try {
        const res = await axios.get(
          `http://localhost:3005/api/product-reviews/user/check?product_id=${product_id}&user_id=${user_id}`
        )
        if (res.data.success !== true) {
          console.error('API 錯誤回傳:', res.data)
          throw new Error('Failed to fetch product reviews')
        }
        console.log('取得村民的評論資料:', res.data)
        return res.data.data
      } catch (error) {
        console.error(error)
      }
    },
    enabled: !!user_id && !!product_id,
    staleTime: 1000 * 60 * 600,
  })
}

export function UseSaveOrUpdateReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (formData) => {
      const res = await axios.post(
        'http://localhost:3005/api/product-reviews/save',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      )
      return res.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['product-reviews', data.user_id])
    },
    onError: (error) => {
      console.error('送出失敗:', error.response?.data?.message || error.message)
    },
  })
}

export const UseProductIngredient = (id) => {
  return useQuery({
    queryKey: ['product-ingredient', id],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:3005/api/product-ingredient/${id}`
      )
      if (res.status !== 200 || res.data.success !== true) {
        throw new Error('Failed to fetch product reviews')
      }
      return res.data.data
    },
    enabled: !!id, // 確保 id 存在才執行
    staleTime: 1000 * 60 * 10, // 10 分鐘快取
  })
}
