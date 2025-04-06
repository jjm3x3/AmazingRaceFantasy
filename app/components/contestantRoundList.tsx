import { getRoundEliminationOrderMapping } from "@/app/utils/teamListUtils"
import Round from "./round";
import Team from "../models/Team";
import IRound from "../models/IRound";
import IContestantRoundData from "../models/IContestantRoundData";

export default function ContestantRoundList({
    perfectRoundScores,
    contestantRoundScores,
    perfectTeamList,
    contestantTeamList,
    contestantName
}: {
        perfectRoundScores: IRound[]
        contestantRoundScores: IRound[]
        perfectTeamList: Team[]
        contestantTeamList: Team[]
        contestantName: string
    }) {

    const roundElimMapping = getRoundEliminationOrderMapping(perfectTeamList);

    return (<>
        <div className="text-center">
            {perfectRoundScores.map((round: IRound, roundNumber: number) => {
                if (roundNumber !== round.round) {
                    console.warn("Something is wrong that the rounds are out of order");
                }

                const perfectRound = round.contestantRoundData.filter((x: IContestantRoundData) => x.name === "*perfect*")[0];
                const perfectScore = perfectRound.roundScore;
                const grandTotal = perfectRound.totalScore;

                const contestantRound = contestantRoundScores[roundNumber]; // check round number
                const filteredContestantRound = contestantRound.contestantRoundData.filter((x: IContestantRoundData) => x.name === contestantName)[0];
                const contestantRoundScore = filteredContestantRound.roundScore;
                const contestantGrandTotal = filteredContestantRound.totalScore;

                const elimOrder = roundElimMapping[roundNumber];

                return <Round
                    key={"round"+roundNumber}
                    roundNumber={roundNumber}
                    eliminationOrder={elimOrder}
                    perfectTeamList={perfectTeamList}
                    contestantTeamList={contestantTeamList}
                    perfectWeekScore={perfectScore}
                    contestantWeekScore={contestantRoundScore}
                    perfectGrandTotal={grandTotal}
                    contestantGrandTotal={contestantGrandTotal}
                />;
            })}
        </div>
    </>);
}
