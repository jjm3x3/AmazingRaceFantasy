import Team from '../models/Team'

export function shouldBeScored(teamList: Team[], team: Team, roundNumber: number): boolean {

    const teamPosition = teamList.length - teamList.indexOf(team)

    const currentWeek = roundNumber+1
    const listHasTeamBeingEliminated = teamPosition <= currentWeek

    return team.isInPlay(roundNumber) && !listHasTeamBeingEliminated
}

export function getNumberOfRounds(teams: Team[]): number {
    return teams.reduce(
       (acc: number, x: Team) => {
           return x.eliminationOrder > acc && x.eliminationOrder !== Number.MAX_VALUE ? x.eliminationOrder : acc
       }, 0)
}

