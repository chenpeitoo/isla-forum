import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation' // 引入 useRouter 用於頁面導向
import React from 'react'

// --- 步驟一：定義 API 呼叫函式 ---
// 內部函式，用於呼叫新增商品的 API。
// 它接收不包含 product_id 的商品資料。
const createProductAPI = async (productData) => {
  try {
    // 使用 POST 方法，並將商品資料作為請求主體發送
    const response = await axios.post(
      // 確保 API 端點與您的後端設定一致
      `http://localhost:3005/api/product/create`,
      productData
    )

    // 即使 HTTP 狀態碼是 2xx，也再次檢查後端自訂的 success 旗標
    if (response.data?.success === false) {
      // 如果後端明確表示失敗，拋出後端提供的錯誤訊息
      throw new Error(
        response.data.message || '後端回報了一個錯誤但未提供訊息。'
      )
    }

    // API 呼叫成功，回傳後端的響應資料
    return response.data
  } catch (error) {
    // 錯誤處理：從 axios 的 error 物件中提取最精確的錯誤訊息
    const errorMessage =
      error.response?.data?.message || // 優先使用後端在錯誤響應中提供的訊息
      error.message || // 其次使用 axios 或網路層面的錯誤訊息
      '發生未知的錯誤' // 最後的備用訊息

    // 將整理過的錯誤訊息再次拋出，讓 React Query 的 onError 回呼可以接收到
    throw new Error(errorMessage)
  }
}

// --- 步驟二：建立並匯出主要的 Custom Hook ---
// 這個 Hook 封裝了所有與「新增商品」相關的狀態管理和副作用。
export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  // 使用 useRef 來追蹤載入中 toast 的 ID，避免在 re-render 時丟失
  const loadingToastId = React.useRef(null)

  return useMutation({
    // mutationFn 指定了執行異步操作的函式
    mutationFn: createProductAPI,

    // onMutate：在 mutation 執行前立即觸發。非常適合用來顯示載入狀態。
    onMutate: async () => {
      // 顯示一個手動關閉的 "載入中" 提示，提升使用者體驗
      loadingToastId.current = toast.loading('正在新增商品，請稍候...')
    },

    // onSuccess：在 mutation 成功後觸發
    onSuccess: (data) => {
      // `data` 是從 createProductAPI 成功回傳的資料
      // `variables` 是當初傳給 mutate 函式的參數 (productData)
      toast.success(data.message || '商品新增成功！')

      // 關鍵步驟：讓「商品列表」的查詢快取失效。
      // 這會告訴 React Query，key 為 ['products'] 的這筆資料已經過期了。
      // 當使用者下次訪問商品列表頁時，React Query 會自動重新獲取最新的資料。
      queryClient.invalidateQueries({ queryKey: ['products'] })

      // 新增成功後，將使用者導向到商品管理列表頁
      // 請根據您的路由結構調整此路徑
      //   router.push('/admin/products')
    },

    // onError：在 mutation 拋出錯誤時觸發
    onError: (error) => {
      // `error` 是從 createProductAPI 中被拋出的那個帶有具體訊息的 Error 實例
      // 顯示具體的錯誤訊息，極大地幫助了除錯
      toast.error(`新增失敗: ${error.message}`)
    },

    // onSettled：無論成功或失敗，mutation 完成後都一定會觸發
    // 這是執行清理副作用 (cleanup side-effects) 的絕佳位置。
    onSettled: () => {
      // 無論成功或失敗，都關閉 "載入中" 的提示
      if (loadingToastId.current) {
        toast.dismiss(loadingToastId.current)
      }
    },
  })
}
