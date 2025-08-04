
import './globals.css'

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
        {children}
      </body>
    </html>
  )
}