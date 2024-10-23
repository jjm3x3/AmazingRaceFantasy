import IContestantRoundData from "./IContestantRoundData";

export default interface IRound {
  round: number;
  contestantRoundData: IContestantRoundData[];
}
