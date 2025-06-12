'use client'

import { useAuth } from '@/hook/use-auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function LoginPage() {
  const router = useRouter()
  const { login, initAuth } = useAuth()
  const [memAuth, setMemAuth] = useState({
    email: 'johnsmith@gmail.com',
    password: '12345',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // ==== handle login form ====
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await login(memAuth.email, memAuth.password)
      const isAuthLocal = localStorage.getItem('jwtToken') || false
      if (isAuthLocal) {
        alert('登入成功')
        router.push('/')
      } else {
        setError('登入失敗，請檢查您的帳號密碼')
      }
    } catch (error) {
      setError('登入過程中發生錯誤')
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const isAuthLocal = localStorage.getItem('jwtToken') || false
    if (isAuthLocal) router.push('/')
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-700 mb-2">
            <span className="text-red-500">ISLA</span> 管理員登入
          </h1>
          <p className="text-gray-600">歡迎回來，請登入您的帳戶</p>
        </div>

        {/* Test accounts info */}
        <Card className="bg-gray-50 border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-700">
              測試帳號
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex justify-between">
                <span className="font-medium">admin:</span>
                <span>admin@isla.com</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Login form */}
        <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-xl">
          <CardContent className="pt-6">
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  電子郵件
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={memAuth.email}
                  onChange={(e) =>
                    setMemAuth({ ...memAuth, email: e.target.value })
                  }
                  className="w-full"
                  placeholder="請輸入您的電子郵件"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  密碼
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={memAuth.password}
                    onChange={(e) =>
                      setMemAuth({ ...memAuth, password: e.target.value })
                    }
                    className="w-full pr-10"
                    placeholder="請輸入您的密碼"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l1.414-1.414M14.12 14.12l1.414 1.414M14.12 14.12L15.536 15.536M14.12 14.12l-4.242-4.242"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="text-right">
                  <Link
                    href=""
                    className="text-sm text-red-400 hover:text-red-500 hover:underline"
                  >
                    忘記密碼？
                  </Link>
                </div>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full bg-red-400 hover:bg-red-500 text-white cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? '登入中...' : '登入'}
              </Button>
            </form>

            {/* Register link */}
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-600">還沒有帳戶？ </span>
              <Link
                href="register"
                className="text-sm text-red-400 hover:text-red-500 hover:underline font-medium"
              >
                立即註冊
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
