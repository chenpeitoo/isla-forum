// /hooks/useUpdateProduct.js
// 這個檔案整合了 API 呼叫函式與 React Query 的 custom mutation hook。

import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify' // 或者您使用的任何通知庫

// --- 步驟一：定義 API 呼叫函式 ---
// 這個函式被定義在檔案內部，不需要被匯出 (export)，
// 因為它只會被下面我們即將匯出的 useUpdateProduct Hook 所使用。
// 這是一種封裝 (encapsulation) 的實踐。
const updateProductAPI = async (productData) => {
  const { product_id } = productData

  if (!product_id) {
    throw new Error('呼叫 API 時缺少 product_id')
  }

  try {
    const res = await axios.put(
      `http://localhost:3005/api/product/edit/${product_id}`,
      productData
    )

    // 即使 status 是 200，也檢查後端自訂的 success flag
    if (res.data?.success === false) {
      throw new Error(
        res.data?.message || '商品更新失敗，但伺服器未提供錯誤訊息。'
      )
    }

    // 成功時，回傳後端給的資料
    return res.data
  } catch (error) {
    // 從 axios 的 error 物件中提取更詳細的錯誤訊息
    const errorMessage =
      error.response?.data?.message || error.message || '發生未知的網路錯誤'
    // 將錯誤再次拋出，讓 React Query 的 onError 回呼可以接收到
    throw new Error(errorMessage)
  }
}

// --- 步驟二：建立並匯出主要的 Custom Hook ---
// 這是這個檔案對外提供的唯一出口。
export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    // mutationFn 直接使用我們在上面定義的內部函式
    mutationFn: updateProductAPI,

    // onSuccess 回呼：在 mutation 成功後觸發
    onSuccess: (data, variables) => {
      // data 是從 updateProductAPI 成功回傳的資料
      // variables 是傳給 mutationFn 的參數 (即 productData)
      toast.success(data?.message || '商品更新成功！')

      // 讓相關的快取失效，以觸發資料重新整理
      // 1. 讓「單一商品」的查詢失效 (例如商品詳情頁)
      queryClient.invalidateQueries({
        queryKey: ['product', variables.product_id],
      })

      // 2. 讓「商品列表」的查詢失效 (例如商品管理列表頁)
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },

    // onError 回呼：在 mutation 拋出錯誤時觸發
    onError: (error) => {
      toast.error(`更新失敗: ${error.message}`)
    },
  })
}
