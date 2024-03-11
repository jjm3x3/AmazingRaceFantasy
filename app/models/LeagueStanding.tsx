import Team from '../models/Team'
import { shouldBeScored } from '../utils/teamListUtils'
import IRound from '../models/IRound'

export default class LeagueStanding {
    
    static generateContestantRoundScores(contestantTeamsList: Team[], numberOfRounds: number, contestantName: string) {

    const contestantRoundScores: IRound[] = []

    let grandTotal = 0
    for(let i = 0; i < numberOfRounds; i++) {
        const roundScore = contestantTeamsList.reduce(
            (acc: number, x: Team) => {
                const teamShouldBeScored = shouldBeScored(contestantTeamsList, x, i)

                return teamShouldBeScored ? acc + 10 : acc
            }, 0)
        grandTotal += roundScore
        contestantRoundScores.push({
            round: i,
            contestantRoundData:[{
                name: contestantName,
                roundScore: roundScore,
                totalScore: grandTotal
            }]
        })
    }

    return contestantRoundScores
}

} 
