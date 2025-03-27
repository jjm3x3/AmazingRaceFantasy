import Team from "../models/Team";

interface RoundEliminationOrderMapping {
    [Key: string]: number;
}

export function shouldBeScored(teamList: Team[], team: Team, roundNumber: number): boolean {

    const teamPosition = teamList.length - teamList.indexOf(team);

    const currentWeek = roundNumber+1;
    const listHasTeamBeingEliminated = teamPosition <= currentWeek;

    return team.isInPlay(currentWeek) && !listHasTeamBeingEliminated;
}

function getRoundEliminationOrderMapping(teamList: Team[]): RoundEliminationOrderMapping {

    const setOfEliminationOrders = getUniqueEliminationOrders(teamList);
    const listOfEliminationOrders = Array.from(setOfEliminationOrders)
    listOfEliminationOrders.sort((x, y) => Number(x) - Number(y));

    const mapping: RoundEliminationOrderMapping = {};
    listOfEliminationOrders.forEach((t, i) => {
        mapping[i] = Number(t);
    });

    return mapping;
}

function getUniqueEliminationOrders(teams: Team[]): Set<number> {
    const seenOrders = new Set<number>();
    teams.filter(
        (t) => t.eliminationOrder !== Number.MAX_VALUE
            && t.eliminationOrder !== 0
    ).forEach((t) => {
        seenOrders.add(t.eliminationOrder);
    });
    return seenOrders;
}

export function getNumberOfRounds(teams: Team[]): number {
    const seenOrders = getUniqueEliminationOrders(teams);

    return seenOrders.size;
}

