import Image from 'next/image'
import Link from 'next/link'

export default function Home() {

    return (
      <div>
          <Image 
            src="/MeixnerAmzingRaceFantacyLeageHome.svg" 
            fill
            alt="Landing Page which has the title of 'Meixner's Amazing Race Fantasy League' and the subtitle 'A web tool to help run an Amazing Race fantasy legue'"
            />
          <div className="menu-box">
            <Link className="menu-item" href="/contestants">Contestant List</Link>
          </div>  
      </div>
    )
}
