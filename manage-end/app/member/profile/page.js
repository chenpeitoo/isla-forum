'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hook/use-auth'
import { cities } from './data/CityCountyData'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, User, MapPin } from 'lucide-react'

export default function ProfilePage() {
  const { initAuth } = useAuth()
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
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // 處理地址
  const areas =
    cities.filter((v) => v.CityName === text.CityName)[0]?.AreaList || []

  // 當城市改變時，重置區域和郵遞區號
  const handleCityChange = (cityName) => {
    setText((prev) => ({
      ...prev,
      CityName: cityName,
      AreaName: '',
      ZipCode: '',
    }))
  }

  // 當區域改變時，自動填入郵遞區號
  const handleAreaChange = (areaName) => {
    const selectedArea = areas.find((area) => area.AreaName === areaName)
    setText((prev) => ({
      ...prev,
      AreaName: areaName,
      ZipCode: selectedArea?.ZipCode || '',
    }))
  }

  // 表單提交函數
  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSuccessMessage('')
    setError({ ...defaultProfile })

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

      if (response.ok) {
        if (data.status === 'success') {
          setSuccessMessage('更新個人資料成功！')
          setTimeout(() => setSuccessMessage(''), 3000)
        }
      } else {
        let newError = { ...defaultProfile }
        const serverErrors = data.errors
        if (Array.isArray(serverErrors)) {
          serverErrors.forEach((serverError) => {
            switch (serverError.path) {
              case 'name':
                newError = { ...newError, name: serverError.msg }
                break
              case 'nickname':
                newError = { ...newError, nickname: serverError.msg }
                break
              case 'tel':
                newError = { ...newError, tel: serverError.msg }
                break
              case 'skin_type':
                newError = { ...newError, skinType: serverError.msg }
                break
              case 'city':
                newError = { ...newError, CityName: serverError.msg }
                break
            }
          })
          setError(newError)
        } else {
          console.log('未知錯誤')
        }
      }
    } catch (error) {
      console.error('錯誤：', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('jwtToken') || null
    if (!token) return

    async function getProfile() {
      setIsLoading(true)
      try {
        const response = await fetch(
          'http://localhost:3005/api/member/profile',
          {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        const data = await response.json()

        if (response.ok && data?.data) {
          const profileData = data.data
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
      } finally {
        setIsLoading(false)
      }
    }
    getProfile()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">載入中...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 成功訊息 */}
        {successMessage && (
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="text-green-700">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* 會員資料 */}
        <Card className={'mt-6 py-8'}>
          <h3 className="text-xl text-red-400 font-semibold text-center">
            基本資料
          </h3>
          <CardContent className={'py-6'}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 本名 */}
              <div className="space-y-2">
                <Label htmlFor="name">本名 *</Label>
                <Input
                  id="name"
                  value={text.name}
                  onChange={(e) => setText({ ...text, name: e.target.value })}
                  className={error.name ? 'border-red-500' : ''}
                />
                {error.name && (
                  <p className="text-sm text-red-500">{error.name}</p>
                )}
              </div>

              {/* 暱稱 */}
              <div className="space-y-2">
                <Label htmlFor="nickname">暱稱 *</Label>
                <Input
                  id="nickname"
                  value={text.nickname}
                  onChange={(e) =>
                    setText({ ...text, nickname: e.target.value })
                  }
                  className={error.nickname ? 'border-red-500' : ''}
                />
                {error.nickname && (
                  <p className="text-sm text-red-500">{error.nickname}</p>
                )}
              </div>

              {/* 電話 */}
              <div className="space-y-2">
                <Label htmlFor="tel">電話 *</Label>
                <Input
                  id="tel"
                  value={text.tel}
                  onChange={(e) => setText({ ...text, tel: e.target.value })}
                  className={error.tel ? 'border-red-500' : ''}
                />
                {error.tel && (
                  <p className="text-sm text-red-500">{error.tel}</p>
                )}
              </div>

              {/* 生日 */}
              {/* <div className="space-y-2">
                <Label htmlFor="birthday">生日</Label>
                <Input
                  id="birthday"
                  type="date"
                  value={text.birthday}
                  onChange={(e) =>
                    setText({ ...text, birthday: e.target.value })
                  }
                />
              </div> */}

              {/* 性別 */}
              {/* <div className="space-y-2">
                <Label>性別</Label>
                <RadioGroup
                  value={text.gender}
                  onValueChange={(value) => setText({ ...text, gender: value })}
                  className="flex flex-row space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="男" id="male" />
                    <Label htmlFor="male">男</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="女" id="female" />
                    <Label htmlFor="female">女</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="其他" id="other" />
                    <Label htmlFor="other">其他</Label>
                  </div>
                </RadioGroup>
              </div> */}

              {/* 膚質 */}
              {/* <div className="space-y-2 md:col-span-2">
                <Label>膚質</Label>
                <RadioGroup
                  value={text.skinType}
                  onValueChange={(value) =>
                    setText({ ...text, skinType: value })
                  }
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="中性" id="normal" />
                    <Label htmlFor="normal">中性</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="乾性" id="dry" />
                    <Label htmlFor="dry">乾性</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="敏感性" id="sensitive" />
                    <Label htmlFor="sensitive">敏感性</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="" id="unknown" />
                    <Label htmlFor="unknown">不確定</Label>
                  </div>
                </RadioGroup>
                {error.skinType && (
                  <p className="text-sm text-red-500">{error.skinType}</p>
                )}
              </div>*/}
            </div>
          </CardContent>
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-400 hover:bg-red-500 px-8 py-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  更新中...
                </>
              ) : (
                '送出'
              )}
            </Button>
          </div>
        </Card>

        {/* 提交按鈕 */}
      </form>
    </div>
  )
}
