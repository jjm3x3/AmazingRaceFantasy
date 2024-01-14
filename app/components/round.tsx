import { Fragment } from 'react'
import TeamList from '../components/teamList'

export default function Round({ roundNumber, perfectTeamList }: { roundNumber: number, perfectTeamList: Team[] }) {

    return (<Fragment key={"round details"+roundNumber}>
        <h2 key={"weekHeader"+roundNumber}className="text-xl">Week {roundNumber+1}</h2>
        <div className="text-center flex">
            <div className="basis-1/2">
                <TeamList teamList={perfectTeamList} roundNumber={roundNumber} />
            </div>
        </div>
        <br/>
    </Fragment>)
}
