import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import '@/styles/site.css'

export const metadata: Metadata = {
  description: '长沙青年 AI 社区。让线上信号回到真实现场。',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
  title: {
    default: 'IGN AI — 在真实世界，发生 AI',
    template: '%s — IGN AI',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#11100d',
  viewportFit: 'cover',
}

export default function FrontendLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
