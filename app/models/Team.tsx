
interface ITeam {
    teamName: string
    relationship: string
    isParticipating: boolean
    eliminationOrder: number
}

export default class Team {
    teamName: string;
    relationship: string;
    isParticipating: boolean;
    eliminationOrder: number;

    constructor(inTeam: ITeam) {

        if ((inTeam.eliminationOrder === 0 && !inTeam.isParticipating)) {
            console.warn("Building a team with teamName: '" + inTeam.teamName + "'whose eliminationOrder is 0 (default), but they are also have isParticipating = false. May be a bad team construction");
        } else if (inTeam.eliminationOrder !== 0 && inTeam.eliminationOrder !== Number.MAX_VALUE && inTeam.isParticipating) {

            console.warn("Building a team with teamName: '" + inTeam.teamName + "'whose eliminationOrder non 0 (default) and also no Number.MAX_VALUE, but they are also have isParticipating = true. May be a bad team construction");
        }

        this.teamName = inTeam.teamName;
        this.relationship = inTeam.relationship;
        this.isParticipating = inTeam.isParticipating;
        this.eliminationOrder = inTeam.eliminationOrder;
    }

    isInPlay(roundNumber: number): boolean {
        
        const teamIsParticipating = this.isParticipating;
        const teamHasNotYetBeenEliminated = this.eliminationOrder > roundNumber;

        return teamIsParticipating || teamHasNotYetBeenEliminated;
    }

    friendlyName(): string {
        if (this.teamName.includes("&")) {
            const contestantNames = this.teamName.split("&");

            const firstContestantsFirstName = this.determineFirstName(contestantNames[0].trim());
            const secondContestantsFirstName = this.determineFirstName(contestantNames[1].trim());

            return firstContestantsFirstName + " & " + secondContestantsFirstName;
        } else {
            return this.teamName;
        }
    }

    private determineFirstName(contestantName: string): string {
        const contestantNameParts = contestantName.split(" ");
        if (contestantNameParts.length > 2) {
            const firstTwo = contestantNameParts[0] + " " + contestantNameParts[1];

            if (["Anna Leigh"].includes(firstTwo)) {
                return firstTwo;
            }
        }
        return contestantNameParts[0];
    }

    static getKey(teamName: string): string {
        if (teamName.includes("&")) {
            let seed = "";

            const names = teamName
                .split("&")
                .map(s => s.trim() );

            if (names[0][0] > names[1][0]) {
                seed = names[1] + names[0];
            }
            else {
                seed = names[0] + names[1];
            }
            return seed;
        } else {
            return teamName.replace(/"/g, "").replace(/ /g, "");
        }
    }
}

