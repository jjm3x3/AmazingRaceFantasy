import { Fragment } from 'react'
import Team from '../models/Team'
import { shouldBeScored } from '../utils/teamListUtils'

export default function TeamList({ teamList, roundNumber }: { teamList: Team[], roundNumber: number }) {

    
    return <div>
        {teamList.map(t => {
            const teamPosition = teamList.length - teamList.indexOf(t)

            return (<Fragment key={"teamStanding"+t.teamName+roundNumber}>
                <p key={t.teamName+roundNumber}>
                    {shouldBeScored(t, teamPosition, roundNumber) ? t.teamName : <s>{t.teamName}</s> }
                </p>
            </Fragment>)
        })}
    </div>
}
