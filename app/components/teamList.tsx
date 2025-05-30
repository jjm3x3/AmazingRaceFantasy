import { Fragment } from "react";
import CompetingEntity from "../models/CompetingEntity";
import { shouldBeScored } from "../utils/teamListUtils";

export default function TeamList({
    teamList,
    roundNumber,
    eliminationOrder,
    teamsEliminatedSoFar
}: {
    teamList: CompetingEntity[],
    roundNumber: number
    eliminationOrder: number
    teamsEliminatedSoFar: number
}) {
    return <div>
        {teamList.map(t => {
            return (<Fragment key={"teamStanding"+t.teamName+roundNumber}>
                <p key={t.teamName+roundNumber}>
                    {shouldBeScored(teamList, t, eliminationOrder, teamsEliminatedSoFar) ? t.friendlyName() : <s>{t.friendlyName()}</s> }
                </p>
            </Fragment>);
        })}
    </div>;
}
