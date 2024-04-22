import IRound from './IRound'
import Team from './Team'
import { shouldBeScored } from '../utils/teamListUtils'

export default class LeagueStanding {
    rounds: IRound[]

    constructor() {
        this.rounds = []
    }

    addContestantRoundScores(contestantTeamsList: Team[], numberOfRounds: number, contestantName: string, handicap: int): void {

        let grandTotal = handicap === undefined ? 0 : handicap
        for(let i = 0; i < numberOfRounds; i++) {
            const roundScore = contestantTeamsList.reduce(
                (acc: number, x: Team) => {
                    const teamShouldBeScored = shouldBeScored(contestantTeamsList, x, i)
    
                    return teamShouldBeScored ? acc + 10 : acc
                }, 0)

            grandTotal += roundScore

            if (this.rounds.length > i) {
                const currentRound = this.rounds[i]
                currentRound.contestantRoundData.push({
                    name: contestantName,
                    roundScore: roundScore,
                    totalScore: grandTotal
                })
            }
            else {
                this.rounds.push({
                    round:i,
                    contestantRoundData: [{
                        name: contestantName,
                        roundScore: roundScore,
                        totalScore: grandTotal
                    }]
                })
            }

        }
    }


    static generateContestantRoundScores(contestantTeamsList: Team[], numberOfRounds: number, contestantName: string, handicap: int): IRound[] {

        const result = new LeagueStanding()
        result.addContestantRoundScores(contestantTeamsList, numberOfRounds, contestantName, handicap)

        return result.rounds
    }
} 

