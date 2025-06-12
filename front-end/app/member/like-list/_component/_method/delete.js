import { toast } from 'react-toastify'
export const deleteWishItem = async (formData = {}) => {
  const token = localStorage.getItem('jwtToken')
  if (!token)
    return toast.error('請先登入', {
      position: 'top-right',
      autoClose: 1000,
      hideProgressBar: false,
    })
  let error = ''
  console.log('formData', formData)
  const response = await fetch('http://localhost:3005/api/member/like-list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  }).catch((err) => (error = err))

  const data = (await response).json()
  if (response.ok) {
    console.log('data-like-list-post,', data)
    toast.success('刪除成功', {
      position: 'top-right',
      autoClose: 1000,
      hideProgressBar: false,
    })
  } else {
    console.log('data-like-list-post,', data)
    toast.error(`資料庫連線錯誤${error}`, {
      position: 'top-right',
      autoClose: 1000,
      hideProgressBar: false,
    })
  }
}
