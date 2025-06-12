import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import qs from 'qs'
import React, { useMemo } from 'react'
import { toast } from 'react-toastify'

const fetchProductDetail = async (id) => {
  const res = await axios.get(`http://localhost:3005/api/product/edit/${id}`)
  if (res.status !== 200 || res.data?.success !== true || !res.data?.data) {
    throw new Error('資料庫查無商品資料')
  }
  return res.data.data
}

const updateProductAPI = async (productData) => {
  try {
    const res = await axios.put(
      `http://localhost:3005/api/product/edit/${productData.product_id}`,
      productData
    )
    if (res.status !== 200 || res.data?.success !== true) {
      throw new Error(res.data?.message || '商品更新失敗')
    }
    return response.ok
  } catch {
    console.error('API call failed:', error)
    return false
  }
}

const updateProduct = async (formData) => {
  try {
    const response = await fetch(
      `http://localhost:3005/api/product/edit/${productId}`,
      {
        method: 'PUT', // 或 'POST'
        body: formData, // 直接傳入 FormData 物件
        // 不要設定 'Content-Type': 'multipart/form-data'，瀏覽器會自動加上正確的 boundary
      }
    )

    return response.ok
  } catch (error) {
    console.error('API call failed:', error)
    return false
  }
}

export const useProductManageList = () => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: ['product-manage-list'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3005/api/products', {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          limit: 99999,
          offset: 0,
        },
      })
      if (res.status !== 200 || res.data.status !== 'success') {
        throw new Error('獲取商品失敗')
      }
      return res.data.data
    },
    staleTime: 1000 * 60 * 5,
    //預留token驗證
    // enabled: !!token
  })
  const queryClient = useQueryClient()
  const updateProductMutation = useMutation({
    mutationFn: updateProductAPI,
    onSuccess: () => {
      queryClient.invalidateQueries(['product-manage-list']) // 重新取得
    },
    onError: (error) => {
      console.log('Product update hook Error', error)
    },
  })

  const updateProduct = async (updatedProduct) => {
    return await updateProductMutation.mutateAsync({
      ...updatedProduct,
      product_id: updatedProduct.product_id,
      images: Array.isArray(updatedProduct.images) ? updatedProduct.images : [],
      sale_price: updatedProduct.sale_price ?? null,
      sale_start_date: updatedProduct.sale_start_date ?? null,
      sale_end_date: updatedProduct.sale_end_date ?? null,
      updatedAt: new Date().toISOString().split('T')[0],
    })
  }

  return {
    products: data || [],
    loading: isLoading,
    productError: error,
    updateProduct,
    refetch,
    updateStatus: {
      isPending: updateProductMutation.isPending,
      isSuccess: updateProductMutation.isSuccess,
      isError: updateProductMutation.isError,
      error: updateProductMutation.error,
    },
  }
}

export const useProductManageDelete = () => {
  const { isLoading, error } = useQuery({
    queryKey: ['product-manage-list'],
    queryFn: async () => {
      const res = await axios.delete('http://localhost:3005/api/products', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (res.status !== 200 || res.data.status !== 'success') {
        throw new Error('獲取商品失敗')
      }
      return res
    },
    staleTime: 1000 * 60 * 5,
    //預留token驗證
    // enabled: !!token
  })
  return {
    loading: isLoading,
    productError: error,
  }
}

export function useMutipleOptions() {
  return useQuery({
    queryKey: ['muti-select-options'],
    queryFn: async () => {
      const res = await fetch(
        'http://localhost:3005/api/product-filter/filters/manage'
      )
      if (!res.ok) throw new Error('錯誤，資料截取失敗')
      return res.json()
    },
  })
}

const deleteProductAPI = async (productId) => {
  try {
    const response = await axios.delete(
      `http://localhost:3005/api/product/${productId}`
    )

    if (response.data?.success === false) {
      throw new Error(response.data.message || '後端回報了一個錯誤。')
    }
    return response.data
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || '發生未知的錯誤'
    throw new Error(errorMessage)
  }
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  const loadingToastId = React.useRef(null)

  return useMutation({
    mutationFn: deleteProductAPI,

    onMutate: () => {
      loadingToastId.current = toast.loading('正在刪除商品...')
    },

    onSuccess: (data, productId) => {
      // toast.success(data.message || '商品已成功刪除！')
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.removeQueries({ queryKey: ['product', productId] })
    },

    onError: (error) => {
      toast.error(`刪除失敗: ${error.message}`)
    },

    onSettled: () => {
      if (loadingToastId.current) {
        toast.dismiss(loadingToastId.current)
      }
    },
  })
}
