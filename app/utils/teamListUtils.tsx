import Team from "../models/Team";

interface RoundEliminationOrderMapping {
    [Key: string]: number;
}

export function shouldBeScored(teamList: Team[], team: Team, roundNumber: number, eliminationOrder: number, totaleliminationssofar: number): boolean {

    const teamPosition = teamList.length - teamList.indexOf(team);

    const currentWeek = roundNumber+1;
    const listHasTeamBeingEliminated = teamPosition <= currentWeek;

    return team.isInPlay(eliminationOrder) && !listHasTeamBeingEliminated;
}

export function getNumberOfTeamsToEliminate(teamList: Team[], elimOrder: number): number {
    return teamList.reduce((count: number, team: Team) => {
        if (team.eliminationOrder === elimOrder) {
            count += 1;
        }

        return count;
    }, 0);
}

export function getRoundEliminationOrderMapping(teamList: Team[]): RoundEliminationOrderMapping {
    const setOfEliminationOrders = getUniqueEliminationOrders(teamList);
    const listOfEliminationOrders = Array.from(setOfEliminationOrders)
    listOfEliminationOrders.sort((x, y) => Number(x) - Number(y));

    const mapping: RoundEliminationOrderMapping = {};
    listOfEliminationOrders.forEach((t, i) => {
        mapping[i] = Number(t);
    });

    return mapping;
}

export function getUniqueEliminationOrders(teams: Team[]): Set<number> {
    const seenOrders = new Set<number>();
    teams.filter(
        (t) => t.eliminationOrder !== Number.MAX_VALUE
            && t.eliminationOrder !== 0
    ).forEach((t) => {
        seenOrders.add(t.eliminationOrder);
    });
    return seenOrders;
}

