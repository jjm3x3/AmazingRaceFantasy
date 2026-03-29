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
            let competingEntityElement = (!t.isParticipating && showEliminationStatus) ?  <s key={`eliminated-${t.teamName}`}>{t.teamName}</s> : t.teamName;
            if(roundNumber && eliminationOrder && teamsEliminatedSoFar) {
                competingEntityElement = (shouldBeScored(teamList, t, eliminationOrder, teamsEliminatedSoFar) && showEliminationStatus) ? t.friendlyName() : <s>{t.friendlyName()}</s>;
            }
            const teamKey = t.teamName + (roundNumber ? roundNumber : index);
            return (<Fragment key={"teamStanding"+t.teamName+(roundNumber ? roundNumber : index)}>
                <p key={teamKey}>
                    {competingEntityElement}
                </p>
            </Fragment>);
        })}
    </div>;
}
