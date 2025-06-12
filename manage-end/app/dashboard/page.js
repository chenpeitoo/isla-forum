'use client'

import React, { useState, useEffect } from 'react'
import {
  LayoutGrid,
  WalletCards,
  Warehouse,
  MonitorPlay,
  Sparkles,
  Calendar,
  Clock,
  ChevronRight,
  User,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/hook/use-auth'
import { useRouter } from 'next/navigation'

export function ClockTime() {
  const [time, setTime] = useState(new Date().toLocaleTimeString())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return <>{time}</>
}

export default function Dashboard() {
  const router = useRouter()
  const { user, isAuth } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    if (!isAuth) {
      router.push('/member/login')
    }
  }, [isAuth, router])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    const hour = new Date().getHours()
    if (hour < 12) {
      setGreeting('早安')
    } else if (hour < 18) {
      setGreeting('午安')
    } else {
      setGreeting('晚安')
    }

    return () => clearInterval(timer)
  }, [])

  if (!isAuth) return null

  const user_id = user?.id || '錯誤'
  const nickname = user?.nickname || 'ISLA 管理員'
  const email = user?.email || '錯誤'

  const quickActions = [
    {
      icon: Warehouse,
      title: '商品管理',
      description: '管理您的商品庫存',
      color: 'bg-red-500/20 text-red-600',
      href: '/products',
    },
    {
      icon: MonitorPlay,
      title: '課程管理',
      description: '建立和管理課程',
      color: 'bg-orange-500/20 text-orange-600',
      href: '/courses',
    },
    {
      icon: WalletCards,
      title: '優惠券管理',
      description: '設定促銷活動',
      color: 'bg-pink-500/20 text-pink-600',
      href: '/coupons/products',
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-4xl">
          {/* Welcome Card */}
          <Card className="backdrop-blur-xl bg-white/20 rounded-3xl p-8 mb-8 border border-white/30 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-red-400/20 p-4 rounded-2xl backdrop-blur-sm">
                  <Sparkles className="w-8 h-8 text-red-400" />
                </div>
              </div>

              <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
                {greeting}，{nickname}！
              </CardTitle>

              <p className="text-gray-600 text-lg mb-6">
                歡迎回到 ISLA 管理平台
              </p>
            </CardHeader>

            <CardContent>
              {/* User Info */}
              <div className="backdrop-blur-sm bg-white/30 rounded-2xl p-6 mb-6 border border-white/40">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-red-400/20 p-3 rounded-xl">
                    <User className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      登入的使用者
                    </h3>
                    <p className="text-gray-600">{nickname}</p>
                    <p className="text-gray-500 text-sm">{email}</p>
                  </div>
                </div>

                <Separator className="my-4 bg-white/40" />

                {/* Time Display */}
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-red-400" />
                    <span className="text-gray-700 font-medium">
                      {currentTime.toLocaleDateString('zh-TW', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'long',
                      })}
                    </span>
                  </div>
                  <div className="w-px h-6 bg-gray-300"></div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-red-400" />
                    <span className="text-gray-700 font-medium">
                      現在時間：
                      <ClockTime />
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm text-center">
                選擇下方功能開始管理您的業務
              </p>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="group backdrop-blur-xl bg-white/20 rounded-2xl border border-white/30 shadow-xl hover:bg-white/30 transition-all duration-300 cursor-pointer hover:scale-105"
                onClick={() => router.push(action.href)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`p-4 rounded-2xl ${action.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <action.icon className="w-8 h-8" />
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {action.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4">
                      {action.description}
                    </p>

                    <div className="flex items-center text-red-400 text-sm font-medium group-hover:text-red-500 transition-colors">
                      <span>開始使用</span>
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
