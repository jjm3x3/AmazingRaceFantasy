import { ITableRowData } from "@/app/dataSources/wikiFetch";
import CompetingEntity from "@/app/models/CompetingEntity";
import { isPartialContestantData } from "@/app/utils/wikiQuery";

interface Survivor {
    teamName: string
    relationship: string
    isParticipating: boolean
    finishDay: number
}

export default function parseSurvivorEntities(contestantData :ITableRowData[]): CompetingEntity[] {

    const contestants: Survivor[] = [];
    let previousFinishDay: number = 0;

    contestantData.forEach((element) => {

        if (isPartialContestantData(element)) {
            return;
        }

        let finishDay = null;
        if (element.col7){
            finishDay = element.col7;
        } else if (element.col6) {
            finishDay = element.col6;
        } else if (element.col5) {
            finishDay = element.col5;
        } else {
            finishDay = element.col4;
        }
        if (finishDay === null || finishDay === undefined) {
            throw new ReferenceError("Status is either null or undefined and it should not be");
        }

        const teamName = element.name || element.name2;

        let isParticipating = true;
        let eliminationOrder = 0;
        let isWinner = false;

        if (finishDay.toLowerCase().includes("day")) {
            isParticipating = false;
            const statusMatches = finishDay.match(/Day (\d+)/i);
            eliminationOrder = Number(statusMatches![1]);
        } else if (finishDay.toLowerCase().includes("runner-up")) {
            isParticipating = false;
            eliminationOrder = previousFinishDay + 0.5
        } else if (finishDay.toLowerCase().includes("sole survivor") || element.col3.toLowerCase().includes("sole survivor")) {
            isWinner = true;
        }

        if (eliminationOrder !== 0) {
            // update previousFinishDay
            previousFinishDay = eliminationOrder;
        } else if (!isWinner) {
            // if no eliminationOrder is found, set it to the previous exitDay
            eliminationOrder = previousFinishDay;
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
