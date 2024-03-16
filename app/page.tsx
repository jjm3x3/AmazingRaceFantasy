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
          <div className="menu-tray">
            <div className="menu-box">
              <Link className="menu-item" href="/contestants">Contestant List</Link>
            </div>
            <div className="menu-box">
              <Link className="menu-item" href="/scoring">Scoring</Link>
            </div>
            <div className="menu-box">
              <Link className="menu-item" href="/league-standing">League Standing</Link>
            </div>
          </div>
      </div>
    )
}
