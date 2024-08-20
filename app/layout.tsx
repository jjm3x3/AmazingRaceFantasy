import './globals.scss'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getPages } from '@/app/utils/pages';
import Navigation from './components/navigation/navigation'

export const metadata: Metadata = {
  title: 'X Factor League',
  description: 'A website for all of your fantasy league needs',
}
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pages = getPages() || [];
  return (
    <html lang="en">
      <body className={inter.className}>
        <header>
          <p className="page-title">X Factor Fantasy</p>
          {pages.length > 0 && <Navigation pages={pages} />}
        </header>
        <main>
          {children}
1        </main>
      </body>
    </html>
  )
}
