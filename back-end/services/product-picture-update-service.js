import axios from 'axios'
import FormData from 'form-data'
import { v4 as uuidv4 } from 'uuid'
// const res = await fetch('https://your-worker.example.workers.dev/upload', {
//   method: 'POST',
//   body: form,
// })

export async function updateImageAndGetUrl(file) {
  // 1. 從 file 物件中直接解構出需要的資訊
  const { buffer, mimetype, originalname } = file

  if (!buffer || !mimetype || !originalname) {
    throw new Error('無效的檔案物件，缺少 buffer、mimetype 或 originalname。')
  }

  // 2. 移除所有 Base64 解析的程式碼
  // const matches = base64DataUrl.match(...) // <--- 這段已不再需要

  // 3. 建立 FormData 並直接使用 buffer
  const form = new FormData()
  form.append('file', buffer, {
    filename: originalname, // 使用原始檔名
    contentType: mimetype, // 使用原始檔案類型
  })

  console.log(`準備上傳檔案至 R2: ${originalname} (${mimetype})`)

  // 4. 發送請求至您的 Cloudflare Worker (這部分不變)
  const res = await fetch('https://your-worker.example.workers.dev/upload', {
    method: 'POST',
    body: form,
  })

  if (!res.ok) {
    const text = await res.text()
    console.error(`上傳至 R2 失敗: ${res.status} ${res.statusText}`, text)
    throw new Error(`Upload to R2 failed for file: ${originalname}`)
  }

  const json = await res.json()
  console.log(`檔案 ${originalname} 上傳成功，返回資料:`, json)

  // 假設 worker 回傳的 JSON 中有 url 或 filename 欄位
  return json.url || json.filename
}
