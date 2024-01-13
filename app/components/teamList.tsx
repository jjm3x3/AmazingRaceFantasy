import { Fragment } from 'react'
import Team from '../models/Team'
import { shouldBeScored } from '../utils/teamListUtils'

export default function TeamList({ teamList, roundNumber }: { teamList: Team[], roundNumber: number }) {

    
    return <div>
        {teamList.map(t => {
            return (<Fragment key={"teamStanding"+t.teamName+roundNumber}>
                <p key={t.teamName+roundNumber}>
                    {shouldBeScored(teamList, t, roundNumber) ? t.teamName : <s>{t.teamName}</s> }
                </p>
            </Fragment>)
        })}
    </div>
}
