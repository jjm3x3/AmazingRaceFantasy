import IContestantRoundData from "./IContestantRoundData";

export default interface IRound {
    round: number
    eliminationOrder: number
    teamsEliminatedSoFar: number
    contestantRoundData: IContestantRoundData[]
};
