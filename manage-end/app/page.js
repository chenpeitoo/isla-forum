'use client'
import { ContentLayout } from '@/components/admin-panel/content-layout'
import { useAuth } from '@/hook/use-auth'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
export default function Home() {
  const router = useRouter()
  useEffect(() => {
    const isAuthLocal = localStorage.getItem('jwtToken') || false
    if (isAuthLocal) router.push('/dashboard')
    else router.push('/member/login')
  }, [])
  return <></>
}
