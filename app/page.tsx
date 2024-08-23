import Link from 'next/link'
import Navigation from './components/navigation/navigation'
import IPage from './models/IPage';
import ISubpage from './models/ISubpage';
import { getPages } from '@/app/utils/pages';
import "./styles/homepage.scss";

export default function Home() {
    const pages = getPages() || [];

    const noticeLink = "/active/big-brother-26/scoring"

    return (
        <div>
            <header>
                <p className="page-title">X Factor Fantasy</p>
                {pages.length > 0 && <Navigation pages={pages} />}
            </header>
            <main>
                <p className="site-notice">
                    A new season of the Big Brother Under way. If you are already participating, jump in <Link className="standard-link" href={noticeLink}>here</Link>. If you would like to participate in this league or future leagues please email inquiry to <Link className="standard-link" href="mailto:xfactorleaguesite@gmail.com">xfactorleaguesite@gmail.com</Link>.
                </p>
                {pages.map((p: IPage) => { 
                    const keyName = p.name.toLowerCase().replaceAll(' ', '-');
                    return (<div key={`links-section-${keyName}`}>
                    <p className="league-link-heading" >Links For { p.name } League</p>
                    <div className="md:flex md:flex-row">{
                        p.subpages.map((pSub: ISubpage) => (
                            <p className="standard-link-container md:basis-1/3">
                                <Link className="standard-link" key={`links-section-${keyName}-link-${pSub.name.toLowerCase().replaceAll(' ', '-')}`} href={pSub.path}>{ pSub.name}</Link>
                            </p>
                        ))
                    }</div>
                </div>)
                })}
            </main>
        </div>
    )
}
