'use client'

import '../_component/_style.css/form.css'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hook/use-auth'
// import { useRouter } from 'next/navigation'
// ==== component ====
import BasicProfile from './_component/basic-profile'
import InputText from '../_component/input-text'
import Select from '../_component/select'
import { toast } from 'react-toastify'
import LoadingLottie from '@/app/_components/loading/lottie-loading'
// import Path from '../_component/path/path'
import { getProfile } from './_method/method'
// ==== data ====
import { cities } from './data/CityCountyData'

export default function ProfilePage() {
  // const router = useRouter()
  const { user, initAuth } = useAuth()
  const defaultProfile = {
    name: '',
    nickname: '',
    tel: '',
    gender: '',
    birthday: '',
    skinType: '',
    CityName: '',
    AreaName: '',
    ZipCode: '',
    address: '',
  }
  const [text, setText] = useState({ ...defaultProfile })
  const [error, setError] = useState({ ...defaultProfile })
  console.log('text', text)

  // ==== 處理地址 ====
  const areas = cities.filter((v) => v.CityName == text.CityName)[0]?.AreaList
  // const postCodes = cities
  //   .filter((v) => v.CityName == text.CityName)[0]
  //   ?.AreaList.filter((v) => v.AreaName == text.AreaName)
  // ==== END 處理地址 ====
  // form submit fucntion
  const handleSubmit = async (event) => {
    event.preventDefault()
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
          toast.success('更新個人資料成功', {
            position: 'top-right',
            autoClose: 1000,
            hideProgressBar: false,
          })
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

          toast.error('欄位不合規定', {
            position: 'top-right',
            autoClose: 1000,
            hideProgressBar: false,
          })
        } else {
          console.log('資料庫問題')
        }
        // ==== END 404 status: error ====
      }
      // ====  END 處理資料 ====
    } catch (error) {
      console.log('資料庫問題: ', error)
      toast.error('更新失敗', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
      })
    }
  }

  useEffect(() => {
    getProfile(setText)
  }, [])
  if (!user?.email) {
    return (
      <div>
        <div className="loading-container">
          <LoadingLottie />
        </div>
      </div>
    )
  }
  return (
    <>
      {/* <Path /> */}
      <form onSubmit={handleSubmit}>
        <div className="user-content">
          <h3>會員資料</h3>
          <BasicProfile user={user} />
          <div className="row row-cols-md-2 row-cols-1 g-4">
            <InputText
              text={text}
              title="本名"
              name="name"
              value={text.name}
              setText={setText}
              errorMsg={error.name}
            />
            <InputText
              text={text}
              title="暱稱"
              name="nickname"
              value={text.nickname}
              setText={setText}
              errorMsg={error.nickname}
            />
            <InputText
              text={text}
              title="電話"
              name="tel"
              value={text.tel}
              setText={setText}
              errorMsg={error.tel}
            />
            {/* <!-- input[type=radio] --> */}
            <div className="user-form-input">
              <label htmlFor="skin_type">膚質</label>
              <div className="user-input-box user-radio-box">
                <div className="row row-cols-2">
                  <label htmlFor="skin_type">
                    <input
                      type="radio"
                      name="skin_type"
                      value="中性"
                      onChange={(e) => {
                        setText({ ...text, ['skinType']: e.target.value })
                      }}
                      checked={text.skinType === '中性'}
                    />
                    中性
                  </label>
                  <label htmlFor="skin_type">
                    <input
                      type="radio"
                      name="skin_type"
                      value="乾性"
                      onChange={(e) => {
                        setText({ ...text, ['skinType']: e.target.value })
                      }}
                      checked={text.skinType === '乾性'}
                    />
                    乾性
                  </label>
                </div>
                <div className="row row-cols-2">
                  <label htmlFor="skin_type">
                    <input
                      type="radio"
                      name="skin_type"
                      value="敏感性"
                      onChange={(e) => {
                        setText({ ...text, ['skinType']: e.target.value })
                      }}
                      checked={text.skinType === '敏感性'}
                    />
                    敏感性
                  </label>
                  <label htmlFor="skin_type">
                    <input
                      type="radio"
                      name="skin_type"
                      value=""
                      onChange={(e) => {
                        setText({ ...text, ['skinType']: e.target.value })
                      }}
                      checked={text.skinType === ''}
                    />
                    不確定
                  </label>
                </div>
              </div>
            </div>
          </div>
          <h3>預設地址</h3>
          <div className="row row-cols-md-3 row-cols-1 g-4 w-100">
            <Select
              title="城市"
              name="city"
              arr={cities}
              selectKey="CityName"
              text={text}
              setText={setText}
              errorMsg={error.city}
            />
            <Select
              title="市/區/鄉/鎮"
              name="area"
              arr={areas}
              selectKey="AreaName"
              text={text}
              setText={setText}
            />
            <InputText
              title="郵遞區號"
              name="postcode"
              selectKey="ZipCode"
              value={text.ZipCode}
              disabled="disabled"
            />
          </div>
          <div className="row row-cols-md-2 row-cols-1 w-100">
            <InputText
              text={text}
              title="地址"
              name="address"
              value={text.address}
              setText={setText}
            />
          </div>
          <button className="btn btn-primary">送出</button>
        </div>
      </form>
    </>
  )
}
