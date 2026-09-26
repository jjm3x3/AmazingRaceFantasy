import CompetingEntity from "../models/CompetingEntity";

interface RoundEliminationOrderMapping {
    [Key: string]: number;
}

export function shouldBeScored(teamList: CompetingEntity[], team: CompetingEntity, eliminationOrder: number, totalEliminationsSoFar: number): boolean {

    const teamPosition = teamList.length - teamList.indexOf(team);

    const listHasTeamBeingEliminated = teamPosition <= totalEliminationsSoFar;

    return team.isInPlay(eliminationOrder) && !listHasTeamBeingEliminated;
}

export function getNumberOfTeamsToEliminate(teamList: CompetingEntity[], elimOrder: number): number {
    return teamList.reduce((count: number, team: CompetingEntity) => {
        if (team.eliminationOrder === elimOrder) {
            count += 1;
        }

        return count;
    }, 0);
}

export function getRoundEliminationOrderMapping(teamList: CompetingEntity[]): RoundEliminationOrderMapping {
    const setOfEliminationOrders = getUniqueEliminationOrders(teamList);
    const listOfEliminationOrders = Array.from(setOfEliminationOrders)
    listOfEliminationOrders.sort((x, y) => Number(x) - Number(y));

    const mapping: RoundEliminationOrderMapping = {};
    listOfEliminationOrders.forEach((t, i) => {
        mapping[i] = Number(t);
    });

    return mapping;
}

export function getUniqueEliminationOrders(teams: CompetingEntity[]): Set<number> {
    const seenOrders = new Set<number>();
    teams.filter(
        (t) => t.eliminationOrder !== Number.MAX_VALUE
            && t.eliminationOrder !== 0
    ).forEach((t) => {
        seenOrders.add(t.eliminationOrder);
    });
    return seenOrders;
}

export function convertNamesToTeamList(teamNames: string[], teamDictionary: Map<string, CompetingEntity>): CompetingEntity[] {
    return teamNames.map((x: string) => {
        const teamKey = CompetingEntity.getKey(x);
        const foundTeam = teamDictionary.get(teamKey);
        if (foundTeam === undefined) {
            const closestMatch = findClosestMatch(teamKey, teamDictionary);
            if (closestMatch === undefined) {
                throw new Error(`Missing leagueContestants selected show contestant '${x}' from league source data`);
            } else {
                console.warn(`No exact match found for teamKey: '${teamKey}'. Near match found looks like '${closestMatch.friendlyName()}'`);
                return closestMatch;
            }
        }
        return foundTeam;
    });
}

export function findClosestMatch(targetKey: string, teamDictionary: Map<string, CompetingEntity>): CompetingEntity | undefined {
    const heuristics: number[] = new Array(teamDictionary.size).fill(0);
    let teamIndex = 0;
    teamDictionary.forEach((team, key) => {
        if (targetKey.includes(key)) {
            heuristics[teamIndex]++;
        }
        const individualNames: string[] = team.teamName.split("&");
        const fullName: string[] = [];
        for (let i = 0; i < individualNames.length; i++) {
            if (targetKey.includes(individualNames[i].trim())) {
                heuristics[teamIndex]++;
            }
            if (targetKey.includes(individualNames[i].trim().replace(" ", ""))) {
                heuristics[teamIndex]++;
            }
            fullName.push(...individualNames[i].trim().replace(/["]/g, "").split(" "));
        }
        fullName.forEach((part) => {
            if (targetKey.includes(part)) {
                heuristics[teamIndex]++;
            }
        });
        teamIndex++;
    },);
    const bestHeuristic = Math.max(...heuristics);
    if (bestHeuristic === 0) {
        return undefined;
    }
    const heuristicIndex = heuristics.findIndex((d) => d == bestHeuristic);
    if (heuristicIndex !== -1) {
        return teamDictionary.get(Array.from(teamDictionary.keys())[heuristicIndex]);
    }
    return undefined;
}
