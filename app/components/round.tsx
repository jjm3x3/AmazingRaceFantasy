import { Fragment } from 'react'
import TeamList from '../components/teamList'

export default function Round({
        key,
        roundNumber,
        perfectTeamList,
        contestantTeamList,
        perfectWeekScore,
        contestantWeekScore,
        perfectGrandTotal,
        contestantGrandTotal
    }: {
        key: string
        roundNumber: number
        perfectTeamList: Team[]
        contestantTeamList: Team[]
        perfectWeekScore: number
        contestantWeekScore: number
        perfectGrandTotal: number
        contestantGrandTotal: number
    }) {

    return (<Fragment key={"round details"+roundNumber}>
        <h2 key={"weekHeader"+roundNumber}className="text-xl">Week {roundNumber+1}</h2>
        <div className="text-center flex">
            <div className="basis-1/2">
                <TeamList teamList={perfectTeamList} roundNumber={roundNumber} />
            </div>
            <div className="basis-1/2">
                <TeamList teamList={contestantTeamList} roundNumber={roundNumber} />
            </div>
        </div>
        <br/>
        <p key={"weekTotal"+roundNumber}className="text-center">Weekly Total: {contestantWeekScore}/{perfectWeekScore}</p>
        <p key={"grandTotal"+roundNumber}className="text-center">Grand Total: {contestantGrandTotal}/{perfectGrandTotal}</p>
        <br/>
        <br/>
    </Fragment>)
}
