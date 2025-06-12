'use client'
import { useAuth } from '@/hook/use-auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import RegisterInput from './_component/register-input'
import ImgContainer from './_component/img-container'
// import TheModal from '../_component/modal'
import '../_styles/style.css'
import './_style/register.css'

export default function RegisterPage() {
  const router = useRouter()
  const { user, isAuth, login } = useAuth() // Context
  const defaultRegi = {
    email: '',
    password: '',
    name: '',
    birthday: '',
    tel: '',
  }
  const [regiInfo, setregiInfo] = useState({ ...defaultRegi })
  const [error, setError] = useState({ ...defaultRegi })
  // 彈跳視窗
  // const [showLoginModal, setShowLoginModal] = useState(false)
  // ==== 錯誤受理 ====
  const errorComfirm = (data) => {
    // ==== 404 status: error ====
    let newError = { ...defaultRegi }
    const serverErrors = data.errors
    if (Array.isArray(serverErrors)) {
      console.log('Errors: ', serverErrors)
      serverErrors.forEach((serverError) => {
        switch (serverError.path) {
          case 'email':
            newError = { ...newError, ['email']: serverError.msg }
            break
          case 'password':
            newError = { ...newError, ['password']: serverError.msg }
            break
          case 'name':
            newError = { ...newError, ['name']: serverError.msg }
            break
          case 'tel':
            newError = { ...newError, ['tel']: serverError.msg }
            break
          case 'birthday':
            newError = { ...newError, ['birthday']: serverError.msg }
            break
          case 'existUser':
            toast.error('此使用者已存在', {
              position: 'top-right',
              autoClose: 1000,
              hideProgressBar: false,
            })
            break
        }
      })
      setError(newError)
      toast.error('欄位不符格式', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
      })
    } else {
      toast.error('註冊失敗', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
      })
    }
    // ==== END 404 status: error ====
  }
  // ==== 表單處理 ====
  const handleSubmit = async (e) => {
    e.preventDefault()
    // 新使用者，未從google登入過
    if (!user.email) {
      try {
        const response = await fetch(
          'http://localhost:3005/api/member/register',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(regiInfo),
          }
        )
        const data = await response.json()
        // ==== 清除上次錯誤提示 ====
        setError({ ...defaultRegi })
        // ==== 處理資料 ====
        if (response.ok) {
          toast.success('註冊成功，將導回登入', {
            position: 'top-right',
            autoClose: 1000,
            hideProgressBar: false,
          })
          router.push('/member/login')
          return
          // ==== 200 status: success ====
        } else {
          errorComfirm(data)
        }
      } catch (err) {
        console.log(err)
      }
    }
    // 新使用者(使用google 登入)
    if (user.email) {
      try {
        console.log('新增使用者(google account)')
        const response = await fetch(
          'http://localhost:3005/api/member/register/google',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(regiInfo),
          }
        )
        const data = await response.json()
        // ==== 清除上次錯誤提示 ====
        setError({ ...defaultRegi })
        // ==== 處理資料 ====
        if (response.ok) {
          // ==== 200 status: success ====
          if (data.status === 'success') {
            toast.success('註冊成功，將返回首頁', {
              position: 'top-right',
              autoClose: 1000,
              hideProgressBar: false,
            })
            // 轉跳至login
            router.push('/')
          }
        } else {
          errorComfirm(data)
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
  // ==== END 表單處理 ====
  useEffect(() => {
    // ==== 檢查是否已登入 ====
    if (user.birthday && !user.birthday.includes('undefined')) {
      console.log('register-page: 已登入')
      router.push('profile')
      return
    }
    // ==== END 檢查是否已登入 ====
    setregiInfo({
      ...defaultRegi,
      ['email']: user.email || '',
      ['name']: user.name || '',
      ['tel']: user.tel || '',
    })
    console.log('email: ', user.email)
  }, [isAuth])

  return (
    <>
      <h1 className="regiTitle text-center mb-4 margin-top-minus">
        <span className="title">ISLA</span>會員註冊
      </h1>
      <div className="row row-cols-lg-2 row-cols-1 gx-5 regiBlock">
        {/* banner */}
        <div className="d-lg-block d-none">
          <div className="d-flex flex-wrap"></div>
          <h2 className="regiTitle">
            歡迎加入
            <span className="title">ISLA</span>
          </h2>
          <div className="regiIntro">
            ISLA
            是一個超貼心、懂你的韓系美妝電商品牌，專為年輕族群打造最棒的美妝體驗！我們帶來超夯的韓系美妝好物，還有專業又好玩的美妝課程跟討論區，讓你隨時掌握最新美妝趨勢，和同好一起分享創意靈感。不管你是小白還是美妝老手，ISLA
            都陪你一起解鎖屬於你的美麗冒險！
          </div>
          <ImgContainer />
        </div>
        {/* register panel */}

        <form onSubmit={handleSubmit}>
          <div className="user-content">
            <p>
              以下皆為必填，<span className="user-star">*</span>為往後不可修改
            </p>
            {/* email 如果是google登入，則設為唯讀 */}
            {user.email ? (
              <RegisterInput
                title={'電子信箱'}
                name="email"
                value={regiInfo.email}
                disabled="disabled "
              />
            ) : (
              <RegisterInput
                title={'電子信箱'}
                name="email"
                value={regiInfo.email}
                text={regiInfo}
                setText={setregiInfo}
                errorMsg={error.email}
              />
            )}

            <RegisterInput
              title={'密碼'}
              name="password"
              type="password"
              value={regiInfo.password}
              text={regiInfo}
              setText={setregiInfo}
              errorMsg={error.password}
            />
            <RegisterInput
              title={'本名'}
              name="name"
              value={regiInfo.name}
              text={regiInfo}
              setText={setregiInfo}
              errorMsg={error.name}
            />
            <RegisterInput
              title={'生日'}
              name="birthday"
              type="date"
              value={regiInfo.birthday}
              text={regiInfo}
              setText={setregiInfo}
              errorMsg={error.birthday}
            />
            <RegisterInput
              title={'電話'}
              name="tel"
              value={regiInfo.tel}
              text={regiInfo}
              setText={setregiInfo}
              errorMsg={error.tel}
            />
            <button className="btn btn-primary">註冊</button>
            <div className="d-flex flex-column justify-content-center gap-3">
              <span>
                已經有帳號了?
                <Link href="login" className="text-primary">
                  登入
                </Link>
              </span>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
