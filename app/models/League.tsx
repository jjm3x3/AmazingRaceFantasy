import IRound from "./IRound";
import IContestantRoundData from "./IContestantRoundData";
import CompetingEntity from "./CompetingEntity";
import { shouldBeScored, getNumberOfTeamsToEliminate, getRoundEliminationOrderMapping, getUniqueEliminationOrders, convertNamesToTeamList } from "../utils/teamListUtils";

interface RoundEliminationCountMapping {
    [key: number]: number;
}

export default class League {
    rounds: IRound[];
    teamData: CompetingEntity[];
    numberOfRounds: number;
    teamMap: Map<string, CompetingEntity>;

    constructor(teamData: CompetingEntity[]) {
        this.rounds = [];
        this.teamData = teamData;
        this.teamMap = teamData.reduce((acc: Map<string, CompetingEntity>, t: CompetingEntity) => {
            acc.set(CompetingEntity.getKey(t.teamName), t);

            return acc;
        }, new Map());

        const seenOrders = getUniqueEliminationOrders(this.teamData);

        this.numberOfRounds = seenOrders.size;

        this.setupLeague();
    }

    private setupLeague() {

        const roundElimMapping = getRoundEliminationOrderMapping(this.teamData);
        const teamsElimedThisFar: RoundEliminationCountMapping = {};
        for(let i = 0; i < this.numberOfRounds; i++) {
            const elimOrder = roundElimMapping[i];
            const teamsElimedThisRound = getNumberOfTeamsToEliminate(this.teamData, elimOrder);
            if (i === 0) {
                teamsElimedThisFar[i] = teamsElimedThisRound;
            } else {
                teamsElimedThisFar[i] = teamsElimedThisFar[i-1] + teamsElimedThisRound;
            }
            const countOfTeamsElimedThisFar = teamsElimedThisFar[i];
            this.rounds.push({
                round: i,
                eliminationOrder: elimOrder,
                teamsEliminatedSoFar: countOfTeamsElimedThisFar,
                contestantRoundData: []
            });
        }
    }

    addContestantRoundScores(contestantTeamsListNames: string[], contestantName: string, handicap: number): void {

        const contestantTeamsList = this.getTeamList(contestantTeamsListNames);

        this.calculateContestantRoundScores(
            contestantTeamsList,
            contestantName,
            handicap,
            (roundNumber, elimOrder, countOfTeamsElimedThisFar, contestantLeagueData) => {
                const currentRound = this.rounds[roundNumber]
                currentRound.contestantRoundData.push(contestantLeagueData);
            }
        );
    }

    private calculateContestantRoundScores(
        contestantTeamsList: CompetingEntity[],
        contestantName: string,
        handicap: number,
        addToRoundList: (_n: number, _eo: number, _cot: number, _crd: IContestantRoundData) => void
    ): void {

        let grandTotal = handicap === undefined ? 0 : handicap;
        const numberOfRounds = this.getNumberOfRounds();
        for(let i = 0; i < numberOfRounds; i++) {
            const currentRound = this.rounds[i];
            const elimOrder = currentRound.eliminationOrder;
            const countOfTeamsElimedThisFar = currentRound.teamsEliminatedSoFar;
            const roundScore = contestantTeamsList.reduce(
                (acc: number, x: CompetingEntity) => {
                    const teamShouldBeScored = shouldBeScored(contestantTeamsList, x, elimOrder, countOfTeamsElimedThisFar);

                    return teamShouldBeScored ? acc + 10 : acc;
                }, 0);

            grandTotal += roundScore;

            addToRoundList(i, elimOrder, countOfTeamsElimedThisFar, {
                name: contestantName,
                roundScore: roundScore,
                totalScore: grandTotal
            });
        }
    }

    getNumberOfRounds(): number {
        return this.numberOfRounds;
    }

    generateContestantRoundScores(contestantTeamsList: CompetingEntity[], contestantName: string, handicap: number): IRound[] {

        if (this.numberOfRounds > contestantTeamsList.length) {
            throw new Error("Asking for more rounds that the number of teams in the list");
        }

        const result: IRound[] = [];
        this.calculateContestantRoundScores(
            contestantTeamsList,
            contestantName,
            handicap,
            (roundNumber, elimOrder, teamsElimedSoFar, contestantLeagueData) => {
                result.push({
                    round: roundNumber,
                    eliminationOrder: elimOrder,
                    teamsEliminatedSoFar: teamsElimedSoFar,
                    contestantRoundData: [contestantLeagueData]
                });
            }
        );

        return result;
    }

    getTeamList(contestantTeamsListNames: string[]): CompetingEntity[] {

        return convertNamesToTeamList(contestantTeamsListNames, this.teamMap);
    }
} 

