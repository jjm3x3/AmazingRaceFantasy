import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'X Factor League',
  description: 'A website for all of your fantasy league needs'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html className={inter.className}>
      <body>
        {children}
      </body>
    </html>
  )
}
