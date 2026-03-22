import ContestantRoundData from "./ContestantRoundData";

export default interface IRound {
    round: number
    eliminationOrder: number
    teamsEliminatedSoFar: number
    contestantRoundData: ContestantRoundData[]
};
