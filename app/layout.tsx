import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from './components/navigation/navigation'
import { getPages } from '@/app/utils/pages';
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'X Factor League',
  description: 'A website for all of your fantasy league needs',
}

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
            <Link href="/"><p className="page-title">X Factor Fantasy</p></Link>
            {pages.length > 0 && <Navigation pages={pages} />}
        </header>
        <br/>
        {children}
      </body>
    </html>
  )
}
