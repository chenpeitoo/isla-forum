import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

const LoadingLottie = () => {
  return (
    <div style={{ width: '350px', height: '350px' }}>
      <DotLottieReact src="/loading.lottie" loop autoplay />
    </div>
  )
}

export default LoadingLottie
