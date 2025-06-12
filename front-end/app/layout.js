// import { Geist, Geist_Mono } from 'next/font/google'
import '@fontsource/plaster'
import '@fontsource/noto-sans-tc'
import 'react-toastify/dist/ReactToastify.css'
import Header from './_components/header/header'
import Footer from './_components/footer/footer'
import Path from './_components/path/path'
import '@/app/_styles/globals.scss'
import Provider from './provider'
import Chat from './service-chat/chat'
import ToastClient from './_components/toast-client'
import { relative } from 'path'

export const metadata = {
  title: 'ISLA 美妝生活',
  keywords: [
    'ISLA',
    '島嶼美妝',
    '美妝',
    '化妝品',
    '護膚',
    '美容',
    '化妝教學',
    '美妝論壇',
    '優惠券',
    '購物',
  ],
  description: 'ISLA 島嶼美妝',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hant">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Noto+Sans+TC:wght@100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Provider>
          <Header />
          {/* ToastContainer由客戶端元件引入，避免hydration */}
          <ToastClient />
          <div style={{ marginTop: '80px', position: 'relative' }}>
            <Path />
            {children}
          </div>
          <Footer />
          {/* <ToastContainer /> */}
          {/* <Chat /> */}
        </Provider>
      </body>
    </html>
  )
}
