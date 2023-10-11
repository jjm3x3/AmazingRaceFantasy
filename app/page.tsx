import Image from 'next/image'

export default function Home() {



    const fill = true

    return (
      <div>
          <Image 
            src="/MeixnerAmzingRaceFantacyLeageHome.svg" 
            fill={fill}
            alt="Landing Page which has the title of 'Meixner's Amazing Race Fantasy League' and the subtitle 'A web tool to help run an Amazing Race fantasy legue'"
            />
      </div>
    )
}
