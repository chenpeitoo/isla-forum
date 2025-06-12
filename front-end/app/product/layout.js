'use client'

import {
  QueryClient,
  QueryClientProvider,
  useIsFetching,
} from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import '../_styles/nprogress-custom.css'

function ProgressHandler() {
  const isFetching = useIsFetching()

  useEffect(() => {
    if (isFetching > 0) {
      NProgress.start()
    } else {
      NProgress.done()
    }
  }, [isFetching])

  return null
}

export default function ProductLayout({ children }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <ProgressHandler />
      {children}
    </QueryClientProvider>
  )
}
