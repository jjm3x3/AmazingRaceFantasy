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

