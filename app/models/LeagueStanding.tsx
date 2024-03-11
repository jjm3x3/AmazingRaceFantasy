import IRound from './IRound'
import Team from './Team'
import { shouldBeScored } from '../utils/teamListUtils'

export default class LeagueStanding {
    rounds: IRound[]

    constructor() {
        this.rounds = []
    }

    addContestantRoundScores(contestantTeamsList: Team[], numberOfRounds: number, contestantName: string) {

        let grandTotal = 0
        for(let i = 0; i < numberOfRounds; i++) {
            const roundScore = contestantTeamsList.reduce(
                (acc: number, x: Team) => {
                    const teamShouldBeScored = shouldBeScored(contestantTeamsList, x, i)
    
                    return teamShouldBeScored ? acc + 10 : acc
                }, 0)
            grandTotal += roundScore
            this.rounds.push({
                round: i,
                contestantRoundData:[{
                    name: contestantName,
                    roundScore: roundScore,
                    totalScore: grandTotal
                }]
            })
        }
    }

    static generateContestantRoundScores(contestantTeamsList: Team[], numberOfRounds: number, contestantName: string) {

        const result = new LeagueStanding()
        result.addContestantRoundScores(contestantTeamsList, numberOfRounds, contestantName)

        return result.rounds
    }
} 

