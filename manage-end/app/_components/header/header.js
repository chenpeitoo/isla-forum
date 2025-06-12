'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Search, User, LogIn, LogOut } from 'lucide-react'

import { useAuth } from '@/hook/use-auth'
import { USER_AVA_URL } from '@/_route/img-url'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuth, logout } = useAuth()

  // Hide header on specific pages
  if (
    pathname.includes('login') ||
    pathname.includes('register') ||
    pathname.includes('forget-password') ||
    pathname.includes('dashboard')
  ) {
    return null
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleSearch = () => {
    // Implement search functionality
    console.log('Search clicked')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-center">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="text-3xl font-bold text-orange-600 hover:text-orange-600/80 transition-colors">
            ISLA Company
          </div>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center space-x-4">
          {/* Search Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSearch}
            className="hidden lg:flex"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* User Authentication */}
          {isAuth ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full p-0"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={
                        user?.ava_url
                          ? USER_AVA_URL + user.ava_url
                          : 'http://localhost:3005/images/member/default-user.jpg'
                      }
                      alt={`${user?.name || 'User'} avatar`}
                    />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user?.name && <p className="font-medium">{user.name}</p>}
                    {user?.email && (
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/member/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild className="hidden lg:flex">
                <Link href="/member/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild className="lg:hidden">
                <Link href="/member/login">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
