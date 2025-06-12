'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MemberPage() {
  const router = useRouter()

  useEffect(() => {
    const isAuthLocal = localStorage.getItem('jwtToken') || false
    if (isAuthLocal) {
      router.push('/member/profile')
    }
  }, [])

  return (
    <>
      <div>Member Page</div>
    </>
  )
}
