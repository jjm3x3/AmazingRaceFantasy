import { Fragment } from "react";
import Team from "../models/Team";
import { shouldBeScored } from "../utils/teamListUtils";

export default function TeamList({
    teamList,
    roundNumber,
    eliminationOrder
}: {
    teamList: Team[],
    roundNumber: number
    eliminationOrder: number
}) {
    return <div>
        {teamList.map(t => {
            return (<Fragment key={"teamStanding"+t.teamName+roundNumber}>
                <p key={t.teamName+roundNumber}>
                    {shouldBeScored(teamList, t, roundNumber, eliminationOrder) ? t.friendlyName() : <s>{t.friendlyName()}</s> }
                </p>
            </Fragment>);
        })}
    </div>;
}
