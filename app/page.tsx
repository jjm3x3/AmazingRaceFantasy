import Image from 'next/image'
import Link from 'next/link'

const imageSources = [
    {
        src: 'MeixnerAmzingRaceFantacyLeageHome-360w.svg',
        media: '(max-width: 768px)'
    },
    {
        src: '/MeixnerAmzingRaceFantacyLeageHome.svg'
    }
]

export default function Home() {

    return (
        <div>
            <div className="title-bar">
                <p className="page-title">X Factor Fantasy</p>
            </div>
            <div className="main-content">
                <p className="site-notice">
                    Welcome to X Factor Fantasy! A new season of the Amazing Race has just begun!
                    <br/>
                    <a className="standard-link" href="/scoring"> Jump Into The Action</a>
                </p>
                <p className="current-league-heading" >Links For The Current League</p>
                <Link className="standard-link league-page-link" href="/contestants">Contestants</Link>
                <Link className="standard-link league-page-link" href="/scoring">Scoring</Link>
                <Link className="standard-link league-page-link" href="/league-standing">League Standing</Link>
            </div>
        </div>
    )
}
