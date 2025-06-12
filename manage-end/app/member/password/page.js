'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils' // 若有需要 class 合併工具

export default function PasswordPage() {
  const defaultPass = {
    oriPass: '',
    newPass: '',
    againPass: '',
  }

  const [password, setPassword] = useState({ ...defaultPass })
  const [error, setError] = useState({ ...defaultPass })

  async function changePass() {
    try {
      const token = localStorage?.getItem('jwtToken') || null
      if (!token) return

      const response = await fetch(
        'http://localhost:3005/api/member/password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(password),
        }
      )

      const data = await response.json()
      setError({ ...defaultPass })

      if (response.ok && data.status === 'success') {
        alert('修改密碼成功')
        setPassword({ ...defaultPass })
      } else {
        let newError = { ...defaultPass }
        const serverErrors = data.errors
        if (Array.isArray(serverErrors)) {
          serverErrors.forEach((err) => {
            if (err.path && defaultPass.hasOwnProperty(err.path)) {
              newError[err.path] = err.msg
            }
          })
          setError(newError)
        } else {
          console.log('未知錯誤')
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    changePass()
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setPassword((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto px-4 py-8 space-y-6 my-18 bg-white shadow-md rounded-lg flex gap-3 flex-col"
    >
      <h3 className="text-xl text-red-400 font-semibold text-center">
        密碼變更
      </h3>

      {/* 當前密碼 */}
      <div>
        <Label className="pb-3" htmlFor="oriPass">
          當前密碼
        </Label>
        <Input
          id="oriPass"
          type="password"
          name="oriPass"
          value={password.oriPass}
          onChange={handleChange}
        />
        {error.oriPass && (
          <p className="text-sm text-red-500 mt-1">{error.oriPass}</p>
        )}
      </div>

      <div className="h-px bg-gray-200" />

      {/* 新密碼 */}
      <div>
        <Label className="pb-3" htmlFor="newPass">
          新密碼
        </Label>
        <Input
          id="newPass"
          type="password"
          name="newPass"
          value={password.newPass}
          onChange={handleChange}
        />
        {error.newPass && (
          <p className="text-sm text-red-500 mt-1">{error.newPass}</p>
        )}
      </div>

      {/* 再輸入一次 */}
      <div>
        <Label className="pb-3" htmlFor="againPass">
          再輸入一次
        </Label>
        <Input
          id="againPass"
          type="password"
          name="againPass"
          value={password.againPass}
          onChange={handleChange}
        />
        {error.againPass && (
          <p className="text-sm text-red-500 mt-1">{error.againPass}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-red-400 hover:bg-red-500 cursor-pointer"
      >
        變更
      </Button>
    </form>
  )
}
