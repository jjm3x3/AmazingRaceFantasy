import Link from 'next/link'
import Navigation from './components/navigation/navigation'
import IPage from './models/IPage';
import ISubpage from './models/ISubpage';
import { getPages } from '@/app/utils/pages';
import "./styles/homepage.scss";

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
                    Welcome to X Factor Fantasy! A new season of the Amazing Race has just begun!
                    <br/>
                    <a className="standard-link" href="/scoring"> Jump Into The Action</a>
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
