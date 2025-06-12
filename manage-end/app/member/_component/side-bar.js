'use client'

import { useAuth } from '@/hook/use-auth'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function SideBar() {
  const pathname = usePathname()
  const router = useRouter()
  const [openAvatar, setOpenAvatar] = useState(false)
  const { user, logout, initAuth } = useAuth()

  useEffect(() => {
    const isLogin = async () => {
      await initAuth()
      const isAuthLocal = localStorage.getItem('jwtToken') || false
      if (!isAuthLocal) {
        toast.warning('請先登入')
        router.push('/member/login')
      }
    }
    if (
      !pathname.includes('login') &&
      !pathname.includes('register') &&
      !pathname.includes('forget-password')
    ) {
      isLogin()
    }
  }, [])

  if (
    pathname.includes('login') ||
    pathname.includes('register') ||
    pathname.includes('forget-password')
  ) {
    return null
  }

  return (
    <aside className="lg:w-1/4 w-full p-4 my-10">
      <Card className="flex flex-col items-center gap-4 py-6 justify-center">
        <CardHeader className="text-center w-full">
          <CardTitle className="text-xl font-semibold">
            {user?.nickname || 'ISLA 管理員'}
          </CardTitle>
          <p className="text-sm text-gray-500">
            {user?.email || 'illegal@nomail.com'}
          </p>
        </CardHeader>
        <Button variant="outline" onClick={() => logout()} asChild>
          <span>登出</span>
        </Button>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base text-muted-foreground">
            個人
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li>
              <Link
                href="/member/profile"
                className="text-primary hover:underline"
              >
                基本資料
              </Link>
            </li>
            <li>
              <Link
                href="/member/password"
                className="text-primary hover:underline"
              >
                密碼變更
              </Link>
            </li>
          </ul>
        </CardContent>
      </Card>
    </aside>
  )
}
