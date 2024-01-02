import { Fragment } from 'react'
import { ITeam } from '../utils/wikiQuery'

function shouldBeCrossedOff(teamInfo: ITeam, teamPosition: number, currentWeek: number): boolean {

    const teamIsNotParticipating = !teamInfo.isParticipating
    const teamWasEliminatedThisWeekOrBefore = teamInfo.eliminationOrder <= currentWeek

    const listHasTeamBeingEliminated = teamPosition <= currentWeek

    return (teamIsNotParticipating && teamWasEliminatedThisWeekOrBefore) || listHasTeamBeingEliminated
}

export default function TeamList({ teamList, roundNumber }: { teamList: ITeam[], roundNumber: number }) {
    
    return <div>
        {teamList.map(t => {
            const teamPosition = teamList.length - teamList.indexOf(t)

            return (<Fragment key={"teamStanding"+t.teamName+roundNumber}>
                <p key={t.teamName+roundNumber}>
                    {shouldBeCrossedOff(t, teamPosition, roundNumber+1) ? <s>{t.teamName}</s> : t.teamName }
                </p>
            </Fragment>)
        })}
    </div>
}
