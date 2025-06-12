'use client'

import { useAuth } from '@/hook/use-auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function RegisterPage() {
  const router = useRouter()
  const { user, isAuth } = useAuth()

  const defaultRegi = {
    email: '',
    password: '',
    name: '',
    birthday: '',
    tel: '',
  }
  const [regiInfo, setregiInfo] = useState({ ...defaultRegi })
  const [error, setError] = useState({ ...defaultRegi })

  const errorComfirm = (data) => {
    let newError = { ...defaultRegi }
    const serverErrors = data.errors
    if (Array.isArray(serverErrors)) {
      serverErrors.forEach((serverError) => {
        newError[serverError.path] = serverError.msg
      })
      setError(newError)
    } else {
      console.log('未知錯誤')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setregiInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
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
        setError({ ...defaultRegi })
        if (response.ok && data.status === 'success') {
          alert('註冊成功，將返回登入頁')
          router.push('login')
        } else {
          errorComfirm(data)
        }
      } catch (err) {
        console.log(err)
      }
    }
  }

  useEffect(() => {
    if (user.birthday && !user.birthday.includes('undefined')) {
      router.push('profile')
      return
    }
    setregiInfo({
      ...defaultRegi,
      email: user.email || '',
      name: user.name || '',
      tel: user.tel || '',
    })
  }, [isAuth])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
      <div className="hidden md:flex flex-col justify-center">
        <h2 className="text-4xl font-bold text-orange-600 mb-4">
          歡迎加入 ISLA
        </h2>
        <p className="text-muted-foreground text-lg">ISLA Management 註冊</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md w-full">
        <p className="text-sm text-muted-foreground">
          以下皆為必填，<span className="text-red-500">*</span>為往後不可修改
        </p>

        <div className="space-y-2">
          <Label htmlFor="email">電子信箱 *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={regiInfo.email}
            onChange={handleChange}
            disabled={!!user.email}
            className={error.email ? 'border-red-500' : ''}
          />
          {error.email && <p className="text-sm text-red-500">{error.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">密碼 *</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={regiInfo.password}
            onChange={handleChange}
            className={error.password ? 'border-red-500' : ''}
          />
          {error.password && (
            <p className="text-sm text-red-500">{error.password}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">本名 *</Label>
          <Input
            id="name"
            name="name"
            value={regiInfo.name}
            onChange={handleChange}
            className={error.name ? 'border-red-500' : ''}
          />
          {error.name && <p className="text-sm text-red-500">{error.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthday">生日 *</Label>
          <Input
            id="birthday"
            name="birthday"
            type="date"
            value={regiInfo.birthday}
            onChange={handleChange}
            className={error.birthday ? 'border-red-500' : ''}
          />
          {error.birthday && (
            <p className="text-sm text-red-500">{error.birthday}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tel">電話 *</Label>
          <Input
            id="tel"
            name="tel"
            value={regiInfo.tel}
            onChange={handleChange}
            className={error.tel ? 'border-red-500' : ''}
          />
          {error.tel && <p className="text-sm text-red-500">{error.tel}</p>}
        </div>

        <Button type="submit" className="w-full">
          註冊
        </Button>
        <p className="text-center text-sm">
          或是
          <Link href="/login" className="text-blue-600 hover:underline ml-1">
            登入
          </Link>
        </p>
      </form>
    </div>
  )
}
