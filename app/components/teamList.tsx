import { Fragment } from 'react'
import { ITeam } from '../utils/wikiQuery'

function shouldBeCrossedOff(teamInfo: ITeam, currentWeek: number): boolean {

    const teamIsNotParticipating = !teamInfo.isParticipating
    const teamWasEliminatedThisWeekOrBefore = teamInfo.eliminationOrder <= currentWeek

    return teamIsNotParticipating && teamWasEliminatedThisWeekOrBefore
}

export default function TeamList({ teamList, roundNumber }: { teamList: ITeam[], roundNumber: number }) {
    
    return <div>
        {teamList.map(t => {
            return (<Fragment key={"teamStanding"+t.teamName+roundNumber}>
                <p key={t.teamName+roundNumber}>
                    {shouldBeCrossedOff(t, roundNumber+1) ? <s>{t.teamName}</s> : t.teamName }
                </p>
            </Fragment>)
        })}
    </div>
}
