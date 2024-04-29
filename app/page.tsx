import Link from 'next/link'
import IPage from './models/IPage';
import ISubpage from './models/ISubpage';
import { getPages } from '@/app/utils/pages';

export default function Home() {
    const pages = getPages() || [];

    return (
        <div>
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
