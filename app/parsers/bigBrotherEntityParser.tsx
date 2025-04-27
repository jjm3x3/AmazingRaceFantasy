import { ITableRowData } from "@/app/dataSources/wikiFetch";
import CompetingEntity from "@/app/models/CompetingEntity";
import { isPartialContestantData } from "@/app/utils/wikiQuery";

interface BBHouseGuest {
    teamName: string
    relationship: string
    isParticipating: boolean
    exitedDay: number
}

export default function parseBigBrotherEntities(contestantData :ITableRowData[]): CompetingEntity[] {

    const contestants: BBHouseGuest[] = [];
    let previousExitDay: number = 0;

    contestantData.forEach((element) => {

        if (isPartialContestantData(element)) {
            return;
        }

        let status = null;
        if (element.col5){
            status = element.col5; // help with navigating entry day wirdnes
        } else {
            status = element.col4;
        }
        if (status === null || status === undefined) {
            throw new ReferenceError("Status is either null or undefined and it should not be");
        }
        
        const teamName = element.name || element.name2;

        let isParticipating = true;
        let eliminationOrder = 0;
        let isWinner = false;

        if (status.toLowerCase().includes("evicted")) {
            isParticipating = false;
            const statusMatches = status.match(/Evicted\W*Day (\d+)/i);
            eliminationOrder = Number(statusMatches![1]);
        } else if (status.toLowerCase().includes("expelled")) {
            isParticipating = false;
            eliminationOrder = Number(status.match(/ExpelledDay (\d+)/i)![1]); // covers Luke getting booted
        } else if (status.toLowerCase().includes("exited")) {
            isParticipating = false;
            eliminationOrder = Number(status.match(/ExitedDay (\d+)/i)![1]); // covers Jared leaving after zombie twist
        } else if (status.toLowerCase().includes("runner-upd")) { // added the d to distinguish from amazing-race
            isParticipating = false;
            eliminationOrder = Number(status.match(/Runner-UpDay (\d+)/i)![1]+ ".5"); // covers the final person plus adding .5 to distinguish from the last eviction
        } else if (status.toLowerCase().includes("winner")) {
            isWinner = true;
        }

        if (eliminationOrder !== 0) {
            // update previousExitDay
            previousExitDay = eliminationOrder;
        } else if (!isWinner) {
            // if no eliminationOrder is found, set it to the previous exitDay
            eliminationOrder = previousExitDay;
            const foundContestant = contestants[contestants.length-1];
            if (foundContestant == null) {
                console.debug("found previous contestant to be null");
                isParticipating = true; // implies that this is the first contestant
            } else if (foundContestant.exitedDay === 0) {
                console.debug("previous contestant has not exited yet");
                isParticipating = true; // implies all contestants before this one are still participating
            } else {
                isParticipating = false; // is now false because we have already started to see contestants evicted
                foundContestant.exitedDay = foundContestant.exitedDay + 0.5; // accounts for the default ordering where the person who come first was actually evicted last
            }
        }

        const parsedContestantData = {
            teamName: teamName,
            relationship: element.col2,
            isParticipating,
            exitedDay: eliminationOrder
        };

        contestants.push(parsedContestantData);
    });


    const sortedContestants = contestants.sort(function(a, b){
        return a.exitedDay-b.exitedDay;
    });

    let eliminationOrderCounter = 1;
    const contestantsWithEliminationOrder = sortedContestants.map(function(contestant) {
        let eliminationOrder = Number.MAX_VALUE;
        if (contestant.exitedDay !== 0) {
            eliminationOrder = eliminationOrderCounter;
            eliminationOrderCounter++;
        }

        return new CompetingEntity({
            teamName: contestant.teamName,
            relationship: contestant.relationship,
            isParticipating: contestant.isParticipating,
            eliminationOrder
        });
    });

    const contestantsSortedByEliminationOrder = contestantsWithEliminationOrder.sort(function(a, b){
        return a.eliminationOrder-b.eliminationOrder;
    });

    return contestantsSortedByEliminationOrder;
}
