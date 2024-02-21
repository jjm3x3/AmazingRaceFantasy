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
          <picture>
            {imageSources.map((source,index) => ( <source key={index} srcSet={source.src} media={source.media} />
            ))}
            <Image
              src="/MeixnerAmzingRaceFantacyLeageHome.svg"
              fill
              alt="Landing Page which has the title of 'Meixner's Amazing Race Fantasy Legue' and the subtitle 'A web tool to help run an Amazing Race fantasy legue'"
              >
            </Image>
          </picture>
          <div className="menu-tray">
            <div className="menu-box">
              <Link className="menu-item" href="/contestants">Contestant List</Link>
            </div>
            <div className="menu-box">
              <Link className="menu-item" href="/scoring">Scoring</Link>
            </div>
            <div className="menu-box">
              <Link className="menu-item" href="/leagueStanding">League Standing</Link>
            </div>
          </div>
      </div>
    )
}
