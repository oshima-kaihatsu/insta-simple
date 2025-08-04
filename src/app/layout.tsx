import './globals.css'
import { Providers } from './providers'

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
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}