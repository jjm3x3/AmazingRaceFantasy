import { Fragment } from "react";
import TeamList from "../components/teamList";
import Team from "../models/Team";

export default function Round({
    roundNumber,
    eliminationOrder,
    teamsEliminatedSoFar,
    perfectTeamList,
    contestantTeamList,
    perfectWeekScore,
    contestantWeekScore,
    perfectGrandTotal,
    contestantGrandTotal
}: {
        roundNumber: number
        eliminationOrder: number
        teamsEliminatedSoFar: number
        perfectTeamList: Team[]
        contestantTeamList: Team[]
        perfectWeekScore: number
        contestantWeekScore: number
        perfectGrandTotal: number
        contestantGrandTotal: number
    }) {

    return (<Fragment key={"round details"+roundNumber}>
        <h2 key={"weekHeader"+roundNumber}className="text-xl">Week {roundNumber+1}</h2>
        <div className="text-center flex">
            <div className="basis-1/2">
                <TeamList
                    teamList={perfectTeamList}
                    roundNumber={roundNumber}
                    eliminationOrder={eliminationOrder}
                    teamsEliminatedSoFar={teamsEliminatedSoFar}
                />
            </div>
            <div className="basis-1/2">
                <TeamList
                    teamList={contestantTeamList}
                    roundNumber={roundNumber}
                    eliminationOrder={eliminationOrder}
                    teamsEliminatedSoFar={teamsEliminatedSoFar}
                />
            </div>
        </div>
        <br/>
        <p key={"weekTotal"+roundNumber}className="text-center">Weekly Total: {contestantWeekScore}/{perfectWeekScore}</p>
        <p key={"grandTotal"+roundNumber}className="text-center">Grand Total: {contestantGrandTotal}/{perfectGrandTotal}</p>
        <br/>
        <br/>
    </Fragment>);
}
