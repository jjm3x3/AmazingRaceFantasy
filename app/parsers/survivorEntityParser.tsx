import { ITableRowData } from "@/app/dataSources/wikiFetch";
import CompetingEntity from "@/app/models/CompetingEntity";
import { isPartialContestantData } from "@/app/utils/wikiQuery";

interface Survivor {
    name: string
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

        let rawFinishDay = null;
        if (element.col7){
            rawFinishDay = element.col7;
        } else if (element.col6) {
            rawFinishDay = element.col6;
        } else if (element.col5) {
            rawFinishDay = element.col5;
        } else {
            rawFinishDay = element.col4;
        }
        if (rawFinishDay === null || rawFinishDay === undefined) {
            throw new ReferenceError("Status is either null or undefined and it should not be");
        }

        const teamName = element.name || element.name2;

        let isParticipating = true;
        let finishDay = 0;
        let isWinner = false;

        if (rawFinishDay.toLowerCase().includes("day")) {
            isParticipating = false;
            const statusMatches = rawFinishDay.match(/Day (\d+)/i);
            finishDay = Number(statusMatches![1]);
        } else if (rawFinishDay.toLowerCase().includes("runner-up")) {
            isParticipating = false;
            finishDay = previousFinishDay + 0.5
        } else if (rawFinishDay.toLowerCase().includes("sole survivor") || element.col3.toLowerCase().includes("sole survivor")) {
            isWinner = true;
        }

        if (finishDay !== 0) {
            // update previousFinishDay
            previousFinishDay = finishDay;
        } else if (!isWinner) {
            // if no finishDay is found, set it to the previous exitDay
            finishDay = previousFinishDay;
            const foundContestant = contestants[contestants.length-1];
            if (foundContestant == null) {
                console.debug("found previous contestant to be null");
                isParticipating = true; // implies that this is the first contestant
            } else if (foundContestant.finishDay === 0) {
                console.debug("previous contestant has not exited yet");
                isParticipating = true; // implies all contestants before this one are still participating
            } else {
                isParticipating = false; // is now false because we have already started to see contestants evicted
                foundContestant.finishDay = foundContestant.finishDay + 0.5; // accounts for the default ordering where the person who come first was actually evicted last
            }
        }

        const parsedContestantData = {
            name: teamName,
            relationship: element.col2,
            isParticipating,
            finishDay
        };

        contestants.push(parsedContestantData);
    });


    const sortedContestants = contestants.sort(function(a, b){
        return a.finishDay-b.finishDay;
    });

    let eliminationOrderCounter = 1;
    const contestantsWithEliminationOrder = sortedContestants.map(function(contestant) {
        let eliminationOrder = Number.MAX_VALUE;
        if (contestant.finishDay !== 0) {
            eliminationOrder = eliminationOrderCounter;
            eliminationOrderCounter++;
        }

        return new CompetingEntity({
            teamName: contestant.name,
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
