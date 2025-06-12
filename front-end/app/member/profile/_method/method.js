export async function getProfile(setText) {
  const token = localStorage.getItem('jwtToken') || null
  if (!token) return
  try {
    const token = localStorage.getItem('jwtToken')

    const response = await fetch('http://localhost:3005/api/member/profile', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await response.json()

    if (response.ok && data?.data) {
      const profileData = await data['data']
      // console.log('profileData: ', profileData)
      setText({
        name: profileData?.name || '',
        nickname: profileData?.nickname || '',
        birthday: profileData?.birthday || '',
        gender: profileData?.gender || '',
        tel: profileData?.tel || '',
        skinType: profileData?.skin_type || '',
        CityName: profileData?.city || '',
        AreaName: profileData?.area || '',
        ZipCode: profileData?.postcode || '',
        address: profileData?.address || '',
      })
    }
  } catch (err) {
    console.log(err)
  }
}
// ==== handleSubmit (not use) ====
export const handleSubmit = async (event) => {
  event.preventDefault()
  async function submit(text, setError, initAuth, defaultProfile) {
    const formData = {
      name: text?.name || '',
      nickname: text?.nickname || '',
      tel: text?.tel || '',
      gender: text?.gender || '',
      birthday: text?.birthday || '',
      skin_type: text?.skinType || '',
      city: text?.CityName || '',
      area: text?.AreaName || '',
      postcode: text?.ZipCode || '',
      address: text?.address || '',
    }
    try {
      const token = localStorage.getItem('jwtToken')
      const response = await fetch('http://localhost:3005/api/member/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      // ==== 清除上次錯誤提示 ====
      setError({ ...defaultProfile })
      // ==== 處理資料 ====
      if (response.ok) {
        // ==== 200 status: success ====
        if (data.status === 'success') {
          alert('更新個人資料成功', data)
          initAuth()
        }
      } else {
        // ==== 404 status: error ====
        let newError = { ...defaultProfile }
        const serverErrors = data.errors
        if (Array.isArray(serverErrors)) {
          console.log('Errors: ', serverErrors)
          serverErrors.forEach((serverError) => {
            switch (serverError.path) {
              case 'name':
                newError = { ...newError, ['name']: serverError.msg }
                break
              case 'nickname':
                newError = { ...newError, ['nickname']: serverError.msg }
                break
              case 'tel':
                newError = { ...newError, ['tel']: serverError.msg }
                break
              case 'skin_type':
                newError = { ...newError, ['skin_type']: serverError.msg }
                break
              case 'city':
                newError = { ...newError, ['city']: serverError.msg }
                break
            }
          })
          setError(newError)
        } else {
          console.log('未知錯誤')
        }
        // ==== END 404 status: error ====
      }
      // ====  END 處理資料 ====
    } catch (error) {
      console.error('錯誤：', error)
    }
  }
  submit()
}
