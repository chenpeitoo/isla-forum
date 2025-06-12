'use client'
import { AuthProvider } from '@/hook/use-auth'
import { CartProvider } from './cart/context/cart-context'
import {
  QueryClient,
  QueryClientProvider,
  useIsFetching,
} from '@tanstack/react-query'
import NProgress from 'nprogress'
import { useState, useEffect } from 'react'
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

export default function Provider({ children }) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <>
      <AuthProvider>
        <CartProvider>
          <QueryClientProvider client={queryClient}>
            <ProgressHandler />
            {children}
          </QueryClientProvider>
        </CartProvider>
      </AuthProvider>
    </>
  )
}
