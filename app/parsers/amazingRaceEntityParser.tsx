import { ITableRowData } from "@/app/dataSources/wikiFetch";
import CompetingEntity from "@/app/models/CompetingEntity";
import { isPartialContestantData } from "@/app/utils/wikiQuery";

export default function parseAmazingRaceEntites(contestantData :ITableRowData[]): CompetingEntity[] {

    const contestants: CompetingEntity[] = [];

    let firstContestantFound: boolean = false;
    let teamStarted: boolean = false;

    let previousStatus = "";

    contestantData.forEach((element) => {

        const teamName = element.name;

        let status = element.col4;
        if (status === null || status === undefined || status === "") {
            status = previousStatus
        }
        previousStatus = status;

        if (!firstContestantFound && isPartialContestantData(element)) {
            return;
        }

        if (!teamStarted) {
            let isParticipating = true;
            let eliminationOrder = 0;
            firstContestantFound = true;

            if (status.toLowerCase().includes("eliminated")) {
                isParticipating = false;
                eliminationOrder = Number(status.match(/Eliminated (\d+)/i)![1]);
            } else if (status.toLowerCase().includes("third")) {
                isParticipating = false;
                eliminationOrder = (contestantData.length/2) - 2;
            } else if (status.toLowerCase().includes("runners-up")) {
                isParticipating = false;
                eliminationOrder = (contestantData.length/2) - 1;
            }

            const contestant: CompetingEntity = new CompetingEntity({
                teamName: teamName,
                relationship: element.col2,
                isParticipating,
                eliminationOrder
            });

            if (contestant.teamName) {
                contestants.push(contestant);    
                teamStarted = true;
            } else {
                console.warn("Found a null contestant Name...");    
            }
        } else {
            if (!isPartialContestantData(element)) {
                contestants[contestants.length-1].teamName += " & " + teamName; 
                teamStarted = false;
            }
        }
    });

    return contestants;
}
