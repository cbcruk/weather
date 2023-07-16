import type { Metadata } from 'next'
import Providers from './providers'
import { getTimeState } from './utils'
import './globals.css'

export const metadata: Metadata = {
  title: '날씨',
  description: '현재, 어제, 최저, 최고 온도 정보',
  icons: { icon: '/favicon.ico', apple: '/logo192.png' },
  themeColor: '#000000',
  manifest: '/manifest.json',
}

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" data-theme={getTimeState()}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

export default RootLayout
