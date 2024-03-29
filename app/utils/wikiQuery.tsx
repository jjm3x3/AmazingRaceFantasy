import { IWikipediaContestantData } from './wikiFetch'
import Team from '../models/Team'

export interface ITeam {
    teamName: string
    relationship: string
    isParticipating: boolean
    eliminationOrder: number
}

export function getTeamList(contestantData :IWikipediaContestantData[]): any {

    const contestants: ITeam[] = []

    contestantData.forEach((element, index) => {

        const status = element.status
        let teamName = element.name

        if (status === null || status === undefined) {
            throw new ReferenceError("Status is either null or undefined and it should not be")
        }

        if (index % 2 == 0) {
            let isParticipating = true
            let eliminationOrder = 0

            if (status.toLowerCase().includes('eliminated')) {
                isParticipating = false
                eliminationOrder = Number(status.match(/Eliminated (\d+)/i)![1])
            } else if (status.toLowerCase().includes("third")) {
                isParticipating = false
                eliminationOrder = (contestantData.length/2) - 2
            } else if (status.toLowerCase().includes("runners-up")) {
                isParticipating = false
                eliminationOrder = (contestantData.length/2) - 1
            }

            const contestant: Team = new Team({
                teamName: teamName,
                relationship: element.relationship,
                isParticipating,
                eliminationOrder
            })

            if (contestant.teamName) {
                contestants.push(contestant)    
            } else {
                console.warn("Found a null contestant Name...")    
            }
        } else {
            if (index > 0) {
                contestants[contestants.length-1].teamName += " & " + teamName 
            }
        }
    })

    return { props: { runners: contestants }}
}
