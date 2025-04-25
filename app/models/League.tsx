import IRound from "./IRound";
import Team from "./Team";
import { shouldBeScored, getNumberOfTeamsToEliminate, getRoundEliminationOrderMapping, getUniqueEliminationOrders } from "../utils/teamListUtils";

interface RoundEliminationCountMapping {
    [key: number]: number;
}

export default class League {
    rounds: IRound[];
    teamData: Team[];
    numberOfRounds: number | null = null;

    constructor(teamData: Team[]) {
        this.rounds = [];
        this.teamData = teamData;
    }

    addContestantRoundScores(contestantTeamsList: Team[], numberOfRounds: number, contestantName: string, handicap: number): void {

        let grandTotal = handicap === undefined ? 0 : handicap;
        const roundElimMapping = getRoundEliminationOrderMapping(this.teamData);
        const teamsElimedThisFar: RoundEliminationCountMapping = {};
        for(let i = 0; i < numberOfRounds; i++) {
            const elimOrder = roundElimMapping[i];
            const teamsElimedThisRound = getNumberOfTeamsToEliminate(this.teamData, elimOrder);
            if (i === 0) {
                teamsElimedThisFar[i] = teamsElimedThisRound;
            } else {
                teamsElimedThisFar[i] = teamsElimedThisFar[i-1] + teamsElimedThisRound;
            }
            const countOfTeamsElimedThisFar = teamsElimedThisFar[i];
            const roundScore = contestantTeamsList.reduce(
                (acc: number, x: Team) => {

                    const teamShouldBeScored = shouldBeScored(contestantTeamsList, x, elimOrder, countOfTeamsElimedThisFar);
    
                    return teamShouldBeScored ? acc + 10 : acc;
                }, 0);

            grandTotal += roundScore;

            if (this.rounds.length > i) {
                const currentRound = this.rounds[i];
                currentRound.contestantRoundData.push({
                    name: contestantName,
                    roundScore: roundScore,
                    totalScore: grandTotal
                });
            }
            else {
                this.rounds.push({
                    round:i,
                    eliminationOrder: elimOrder,
                    teamsEliminatedSoFar: countOfTeamsElimedThisFar,
                    contestantRoundData: [{
                        name: contestantName,
                        roundScore: roundScore,
                        totalScore: grandTotal
                    }]
                });
            }

        }
    }

    getNumberOfRounds(): number {
        if (this.numberOfRounds !== null) {
            return this.numberOfRounds;
        }

        const seenOrders = getUniqueEliminationOrders(this.teamData);

        this.numberOfRounds = seenOrders.size;

        return this.numberOfRounds;
    }

    static generateContestantRoundScores(contestantTeamsList: Team[], numberOfRounds: number, contestantName: string, handicap: number): IRound[] {

        const result = new League(contestantTeamsList);
        result.addContestantRoundScores(contestantTeamsList, numberOfRounds, contestantName, handicap);

        return result.rounds;
    }
} 

