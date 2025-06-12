'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LayoutGrid, LogOut, LogIn, User } from 'lucide-react'

import { useAuth } from '@/hook/use-auth'
import { USER_AVA_URL } from '@/_route/img-url'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function UserNav() {
  const router = useRouter()
  const { user, isAuth, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return isAuth ? (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="relative h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      user?.ava_url
                        ? USER_AVA_URL + user.ava_url
                        : 'http://localhost:3005/images/member/default-user.jpg'
                    }
                    alt={`${user?.name || 'User'} avatar`}
                  />
                  <AvatarFallback className="bg-transparent">
                    {user?.name?.[0]?.toUpperCase() || (
                      <User className="w-4 h-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            {user?.nickname && (
              <p className="text-sm font-medium leading-none">
                {user.nickname}
              </p>
            )}
            {user?.email && (
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/member/profile" className="flex items-center">
              <User className="w-4 h-4 mr-3 text-muted-foreground" />
              個人資料
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard" className="flex items-center">
              <LayoutGrid className="w-4 h-4 mr-3 text-muted-foreground" />
              主頁
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:cursor-pointer text-red-600 focus:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          登出
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" asChild className="hidden lg:flex">
        <Link href="/member/login">
          <LogIn className="mr-2 h-4 w-4" />
          登入
        </Link>
      </Button>
      <Button variant="ghost" size="icon" asChild className="lg:hidden">
        <Link href="/member/login">
          <User className="h-5 w-5" />
        </Link>
      </Button>
    </div>
  )
}
