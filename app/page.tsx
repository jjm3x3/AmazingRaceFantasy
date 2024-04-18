import Link from 'next/link'

export default function Home() {

    return (
        <div>
            <header className="title-bar">
                <p className="page-title">X Factor Fantasy</p>
            </header>
            <main className="main-content">
                <p className="site-notice">
                    Welcome to X Factor Fantasy! A new season of the Amazing Race has just begun!
                    <br/>
                    <a className="standard-link" href="/scoring"> Jump Into The Action</a>
                </p>
                <p className="current-league-heading" >Links For The Current League</p>
                <Link className="standard-link league-page-link" href="/contestants">Contestants</Link>
                <Link className="standard-link league-page-link" href="/scoring">Scoring</Link>
                <Link className="standard-link league-page-link" href="/league-standing">League Standing</Link>
            </main>
        </div>
    )
}
