'use client'

import React, { useState, useEffect } from 'react'

import InputPass from '../../_component/input-pass'
export default function Password({ email}) {
  const defaultPass = {
    newPass: '',
    againPass: '',
  }
  const [password, setPassword] = useState({ ...defaultPass })
  const handleSubmit = (e) => {
    e.preventDefault()
  }
  return (
    <>
      <form
        className="d-flex flex-column align-items-center login-form"
        onSubmit={handleSubmit}
      >
        <InputPass
          title={'請輸入新密碼'}
          name="otp"
          value={password.newPass}
          text={password}
          setText={setPassword}
        ></InputPass>
        <InputPass
          title={'請輸入新密碼'}
          name="otp"
          value={password.againPass}
          text={password}
          setText={setPassword}
        ></InputPass>
        <button className="btn btn-primary">確認送出</button>
      </form>
    </>
  )
}
