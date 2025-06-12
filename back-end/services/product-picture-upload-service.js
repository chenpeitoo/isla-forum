import axios from 'axios'
import FormData from 'form-data'
import { v4 as uuidv4 } from 'uuid'

const R2URL = 'https://isla-image.chris142852145.workers.dev'

export async function uploadImageAndGetUrl(fileBuffer, originalFilename) {
  const form = new FormData()

  // 用 UUID 結合原始檔名防止名稱重複
  const safeFilename = `${Date.now()}-${uuidv4()}-${originalFilename}`
  form.append('file', fileBuffer, safeFilename)

  const response = await axios.post(R2URL, form, {
    headers: form.getHeaders(),
  })

  if (response.data?.success && response.data.filename) {
    return response.data.filename
  } else {
    throw new Error('Worker 上傳失敗')
  }
}
