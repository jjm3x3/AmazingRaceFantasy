import './globals.scss'
import { getPages } from '@/app/utils/pages';
import Navigation from './components/navigation/navigation'

export default async function Template({
  children
}: {
  children: React.ReactNode
}) {
  const pages = await getPages();
  return (
    <>
      <header>
        <p className="page-title">X Factor Fantasy</p>
        {pages.length > 0 && <Navigation pages={pages} />}
      </header>
      <main>
        {children}
      </main>
    </>
  )
}
