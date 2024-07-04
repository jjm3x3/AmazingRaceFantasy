import Link from 'next/link'
import Navigation from './components/navigation/navigation'
import IPage from './models/IPage';
import ISubpage from './models/ISubpage';
import { getPages } from '@/app/utils/pages';

export default function Home() {
    const pages = getPages() || [];
    return (
        <div>
            <header>
                <p className="page-title">X Factor Fantasy</p>
                {pages.length > 0 && <Navigation pages={pages} />}
            </header>
            <main>
                <p className="site-notice">
                    Welcome to X Factor Fantasy! A new season of the Big Brother will be starting with it's premire on July 17th. Come back soon to see which House Guests we expect in this season.
                </p>
                {pages.map((p: IPage) => { 
                    const keyName = p.name.toLowerCase().replaceAll(' ', '-');
                    return (<div key={`links-section-${keyName}`}>
                    <p className="league-link-heading" >Links For { p.name } League</p>
                    <div className="flex flex-row">{
                        p.subpages.map((pSub: ISubpage) => (
                            <Link className="standard-link league-page-link" key={`links-section-${keyName}-link-${pSub.name.toLowerCase().replaceAll(' ', '-')}`} href={pSub.path}>{ pSub.name}</Link>
                        ))
                    }</div>
                </div>)
                })}
            </main>
        </div>
    )
}
