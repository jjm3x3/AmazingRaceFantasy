import IRound from "./IRound";
import IContestantRoundData from "./IContestantRoundData";
import Team from "./Team";
import { shouldBeScored, getUniqueEliminationOrders } from "../utils/teamListUtils";

export default class League {
    rounds: IRound[];
    teamData: Team[];
    numberOfRounds: number | null = null;

    constructor(teamData: Team[]) {
        this.rounds = [];
        this.teamData = teamData;
    }

    addContestantRoundScores(contestantTeamsList: Team[], contestantName: string, handicap: number): void {

        this.calculateContestantRoundScores(contestantTeamsList, contestantName, handicap, (roundNumber, contestantLeagueData) => {
            if (this.rounds.length > roundNumber) {
                const currentRound = this.rounds[roundNumber];
                currentRound.contestantRoundData.push(contestantLeagueData);
            }
            else {
                this.rounds.push({
                    round:roundNumber,
                    contestantRoundData: [contestantLeagueData]
                });
            }

        });
    }

    private calculateContestantRoundScores(
        contestantTeamsList: Team[],
        contestantName: string,
        handicap: number,
        addToRoundList: (_n: number, _crd: IContestantRoundData) => void
    ): void {

        let grandTotal = handicap === undefined ? 0 : handicap;
        const numberOfRounds = this.getNumberOfRounds();
        for(let i = 0; i < numberOfRounds; i++) {
            const roundScore = contestantTeamsList.reduce(
                (acc: number, x: Team) => {
                    const teamShouldBeScored = shouldBeScored(contestantTeamsList, x, i);
    
                    return teamShouldBeScored ? acc + 10 : acc;
                }, 0);

            grandTotal += roundScore;

            addToRoundList(i, {
                name: contestantName,
                roundScore: roundScore,
                totalScore: grandTotal
            });
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

    generateContestantRoundScores(contestantTeamsList: Team[], contestantName: string, handicap: number): IRound[] {

        const result: IRound[] = [];
        this.calculateContestantRoundScores(contestantTeamsList, contestantName, handicap, (roundNumber, contestantLeagueData) => {
            result.push({
                round: roundNumber,
                contestantRoundData: [contestantLeagueData]
            });
        });

        return result;
    }
} 

