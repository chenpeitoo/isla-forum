'use client'

import React, { useState, useEffect } from 'react'

export default function MemberPage(props) {
  return (
    <>
      <div>Member Page</div>
    </>
  )
}
// 'use client'

// import { useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import LoadingLottie from '@/app/_components/loading/lottie-loading'

// export default function MemberPage() {
//   const router = useRouter()

//   useEffect(() => {
//     const isAuthLocal = localStorage.getItem('jwtToken') || false
//     if (isAuthLocal) {
//       router.push('/member/profile')
//     } else {
//       router.push('/')
//     }
//     // setLoading(false)
//   }, [])
//   return (
//     <>
//       <div>
//         <div className="loading-container">
//           <LoadingLottie />
//         </div>
//       </div>
//     </>
//   )
// }
