'use client'

// import React, { useState } from 'react'
import InputText from '../../_component/input-text'
import { toast } from 'react-toastify'

export default function Email({
  email = {},
  setEmail = () => {},
  setStep = () => {},
  defaultEmail,
  error = {},
  setError = () => {},
}) {
  // const defaultEmail = { email: '' }
  // const [email, setEmail] = useState({ ...defaultEmail })
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(
        'http://localhost:3005/api/member/forget-pass/otp',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(email),
        }
      )
      const data = await response.json()
      setError({ ...defaultEmail })
      if (response.ok) {
        setStep(2)
        toast.success('認證成功，請準備修改密碼', {
          position: 'top-right',
          autoClose: 1000,
          hideProgressBar: false,
        })
      } else {
        // ==== 404 status: error ====
        let newError = { ...defaultEmail }
        const serverErrors = data.errors
        console.log(serverErrors)
        if (Array.isArray(serverErrors)) {
          // console.log('Errors: ', serverErrors)
          serverErrors.forEach((serverError) => {
            switch (serverError.path) {
              case 'email':
                newError = { ...newError, ['email']: serverError.msg }
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
      }
    } catch (err) {
      toast.error('認證失敗', {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
      })
      console.log(err)
    }
  }
  return (
    <>
      <form
        className="d-flex flex-column align-items-center login-form"
        onSubmit={handleSubmit}
      >
        <div className="login-input-block">
          <InputText
            title={'電子郵件'}
            name="email"
            value={email.email}
            text={email}
            setText={setEmail}
            errorMsg={error.email}
          />
        </div>

        <div className="text-danger">將會有驗證碼六位數送至您的信箱</div>
        <button className="btn btn-primary">送出</button>
      </form>
    </>
  )
}
