import Team from '../models/Team'

export function shouldBeScored(team: Team, teamPosition: number, roundNumber: number): bool {
    
   const currentWeek = roundNumber+1
   const listHasTeamBeingEliminated = teamPosition <= currentWeek

   return team.isInPlay(roundNumber) && !listHasTeamBeingEliminated
}

