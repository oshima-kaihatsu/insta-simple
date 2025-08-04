// src/app/layout.tsx

import { Inter } from 'next/font/google'
import Providers from './providers'
import './globals.css'

// 動的レンダリングを強制
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'InstaSimple Analytics',
  description: 'Instagram分析をシンプルに、効果的に',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}