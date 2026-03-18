import { Fragment } from "react";
import CompetingEntity from "../models/CompetingEntity";
import { shouldBeScored } from "../utils/teamListUtils";

export default function TeamList({
    teamList,
    showEliminationStatus,
    roundNumber,
    eliminationOrder,
    teamsEliminatedSoFar
}: {
    teamList: CompetingEntity[],
    showEliminationStatus: boolean,
    roundNumber?: number
    eliminationOrder?: number
    teamsEliminatedSoFar?: number
}) {
    return <div>
        {teamList.map((t, index) => {
            let shouldBeScoredValue = t.isParticipating;
            if(roundNumber && eliminationOrder && teamsEliminatedSoFar) {
                shouldBeScoredValue = shouldBeScored(teamList, t, eliminationOrder, teamsEliminatedSoFar);
            }
            const teamKey = t.teamName + (roundNumber ? roundNumber : index); 
            return (<Fragment key={"teamStanding"+t.teamName+roundNumber}>
                <p key={teamKey}>
                    {shouldBeScoredValue && showEliminationStatus ? t.friendlyName() : <s>{t.friendlyName()}</s> }
                </p>
            </Fragment>);
        })}
    </div>;
}
