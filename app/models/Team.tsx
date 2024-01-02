import { ITeam } from '../utils/wikiQuery'

export default class Team {
    teamName: string
    relationship: string
    isParticipating: boolean
    eliminationOrder: number

    constructor(inTeam: ITeam) {

        this.teamName = inTeam.teamName
        this.relationship = inTeam.relationship
        this.isParticipating = inTeam.isParticipating
        this.eliminationOrder = inTeam.eliminationOrder
    }

    isInPlay(roundNumber: number): boolean {

        //return x.eliminationOrder === 0 || x.eliminationOrder > i ? acc + 10 : acc
        return this.eliminationOrder === 0 || roundNumber+1 < this.eliminationOrder
    }

}

