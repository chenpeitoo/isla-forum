import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query'
import axios from 'axios'
import qs from 'qs'

//這是取得所有商品資料的函式
//範例： const { products, productsLoading, productsError, brands, categories, tags } = useProducts(filters)
//可參考商品列表的使用來參考

export const useProducts = (filters, { pageSize = 20 } = {}) => {
  const parsedFilters = {
    ...filters,
    brandIds:
      filters.brandIds?.map((id) => Number(id)).filter((id) => !isNaN(id)) ||
      [],
    categoryIds:
      filters.categoryIds?.map((id) => Number(id)).filter((id) => !isNaN(id)) ||
      [],
    tagIds:
      filters.tagIds?.map((id) => Number(id)).filter((id) => !isNaN(id)) || [],
    minRating: Number(filters.minRating) || 0,
    maxRating: Number(filters.maxRating) || 5,
    minPrice: Number(filters.minPrice) || 0,
    maxPrice: Number(filters.maxPrice) || 9999,
    limit: pageSize,
  }

  const filtersQuery = useQuery({
    queryKey: ['filters'],
    queryFn: async () => {
      const res = await axios.get(
        'http://localhost:3005/api/product-filter/filters',
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      if (res.status !== 200) {
        throw new Error('Failed to fetch filters')
      }
      return res.data
    },
    staleTime: 1000 * 60 * 10, // 10 分鐘快取
  })

  const productsQuery = useInfiniteQuery({
    queryKey: ['products', parsedFilters],
    queryFn: async ({ pageParam = 0 }) => {
      const queryParams = {
        ...parsedFilters,
        offset: pageParam * pageSize,
      }

      const res = await axios.get('http://localhost:3005/api/products', {
        params: queryParams,
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: 'brackets' }), // categoryIds[]=1&categoryIds[]=2
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (res.status !== 200 || res.data.status !== 'success') {
        throw new Error('Failed to fetch products')
      }

      return {
        data: res.data.data,
        currentPage: pageParam,
        hasMore: res.data.data.length === pageSize, // 如果返回的數據等於頁面大小，假設還有更多數據
        totalCount: res.data.totalCount, // 假設後端返回總數量
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.currentPage + 1 : undefined
    },
    staleTime: 1000 * 60 * 10,
    enabled: !!filters,
  })

  // 將所有頁面的產品合併為一個陣列
  const allProducts =
    productsQuery.data?.pages?.flatMap((page) => page.data) || []

  return {
    brands: filtersQuery.data?.brands || [],
    categories: filtersQuery.data?.categories || [],
    tags: filtersQuery.data?.tags || [],
    filtersLoading: filtersQuery.isLoading,
    filtersError: filtersQuery.error,

    products: allProducts,
    productsLoading: productsQuery.isLoading,
    productsError: productsQuery.error,

    // 無限滾動相關的方法和狀態
    fetchNextPage: productsQuery.fetchNextPage,
    hasNextPage: productsQuery.hasNextPage,
    isFetchingNextPage: productsQuery.isFetchingNextPage,

    // 其他有用的狀態
    totalProducts: productsQuery.data?.pages?.[0]?.totalCount || 0,
    currentPageCount: productsQuery.data?.pages?.length || 0,
    refetchProducts: productsQuery.refetch,
  }
}

export const UseProductDetail = (id) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3005/api/product/${id}`)
      if (res.status !== 200 || res.data.success !== true) {
        throw new Error('資料庫查無商品資料')
      }
      return res.data.data
    },
    enabled: !!id, // 確保 id 存在才執行
    staleTime: 1000 * 60 * 10, // 10 分鐘快取
  })
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
