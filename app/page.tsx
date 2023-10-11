import Image from 'next/image'

export default function Home() {



    const fill = true

    return (
      <div>
          <Image 
            src="/MeixnerAmzingRaceFantacyLeageHome.svg" 
            fill={fill}
            />
      </div>
    )
}
