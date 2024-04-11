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
            <p className="site-notice">
                Welcome to X Factor Fantasy! A new season of the Amazing Race has just begun!
            </p>
        </div>
    )
}
