import IRound from './IRound'
import Team from './Team'
import { shouldBeScored } from '../utils/teamListUtils'

export default class LeagueStanding {
    rounds: IRound[]

    constructor() {
        this.rounds = []
    }
    
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
