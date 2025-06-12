'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
// import { useRouter } from 'next/navigation'

const AuthContext = createContext(null)
AuthContext.displayName = 'AuthContext'
// ==== 清除 localstorage 的function ====

export function AuthProvider({ children }) {
  // const router = useRouter()
  // set user default status
  const defaultUser = {
    id: 0,
    name: '',
    nickname: '',
    email: '',
    birthday: '',
    ava_url: '',
    points: '',
    level: '',
    tel: '',
    address: '',
    mem_cpon: 0,
    token: '',
  }
  const [user, setUser] = useState(defaultUser)
  const isAuth = Boolean(user.id)
  // === 用於驗證登入狀態 ====
  // const [isAuth, setIsAuth] = useState(true)
  const cleanStorage = () => {
    console.warn('驗證失敗，清除 token')
    localStorage.removeItem('jwtToken')
    localStorage.removeItem('googleToken')
  }
  // ==== 錯誤提示 ====
  const errorComfirm = (data, setError) => {
    // setError用於承接輸入錯誤，用於提示
    // ==== 404 status: error ====
    let newError = { email: '', password: '' }
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
        }
      })
      setError(newError)
      toast.error('欄位不符格式', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
      })
    }
    // ==== END 404 status: error ====
  }
  // 取得使用者資料(驗證後才可使用)
  const initAuth = async () => {
    const token = localStorage.getItem('jwtToken')
    if (!token) {
      console.log('not get token')
      cleanStorage()
      return
    }
    // get user's data from db
    try {
      const response = await fetch('http://localhost:3005/api/member/login', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = await response.json()
      if (response.ok && data?.data) {
        console.log('useAuth: ', data.data)
        setUser({ ...data.data, token }) // ✅ token 傳進 user 確保可以從 localStorage取得
        // setUser(data.data)
        // setIsAuth(true)
      } else {
        cleanStorage()
      }
    } catch (err) {
      console.error('驗證錯誤:', err)
      cleanStorage()
    }
  }
  // login function
  const login = async (email, passowrd, setError) => {
    // setError用於承接輸入錯誤，用於提示
    // fetch login auth api (post)
    try {
      const response = await fetch('http://localhost:3005/api/member/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: passowrd,
          isAdmin: false,
        }),
      })
      const data = await response.json()

      if (response.ok) {
        if (!data || !data.data || !data.data.token) {
          console.log('沒有取得token，登入失敗', data)
          return
        }
        // set token to localStorage
        localStorage.setItem('jwtToken', data['data']['token'])
        console.log('check token: ', data['data']['token'])
        console.log('後端回應成功')
      } else {
        errorComfirm(data, setError)
        // console.error('登入失敗', data.message)
      }
    } catch (err) {
      console.log(err)
    }
    // 取得使用者資料
    initAuth()
  }

  // logout function
  const logout = () => {
    setUser(defaultUser)
    cleanStorage()
    // setIsAuth(false)
    // router.push('/member/login')
  }
  // 初始讀取 jwtToken 並取得使用者資料
  useEffect(() => {
    // 取得使用者資料
    initAuth()
  }, [])
  return (
    <>
      <AuthContext.Provider value={{ user, isAuth, login, logout, initAuth }}>
        {children}
      </AuthContext.Provider>
    </>
  )
}

export const useAuth = () => useContext(AuthContext)
