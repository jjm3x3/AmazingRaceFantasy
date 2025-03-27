import Team from "../models/Team";

export function shouldBeScored(teamList: Team[], team: Team, roundNumber: number): boolean {

    const teamPosition = teamList.length - teamList.indexOf(team);

    const currentWeek = roundNumber+1;
    const listHasTeamBeingEliminated = teamPosition <= currentWeek;

    return team.isInPlay(currentWeek) && !listHasTeamBeingEliminated;
}

function getUniqueEliminationOrders(teams: Team[]): Set {
    const seenOrders = new Set();
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

