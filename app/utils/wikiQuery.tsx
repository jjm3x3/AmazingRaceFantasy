import { IWikipediaContestantData } from './wikiFetch'

export interface ITeam {
    teamName: string
    relationship: string
    isParticipating: boolean
    eliminationOrder: string
}

export function getTeamList(contestantData :IWikipediaContestantData[]): any {

    const contestants: ITeam[] = []

    contestantData.forEach((element, index) => {

        const status = element.status
        let teamName = element.name

        if (index % 2 == 1) {
            let isParticipating = true
            let eliminationOrder = ''

            if (status === null || status === undefined) {
                throw new ReferenceError("Status is either null or undefined and it shouldn not be")
            }

            if (status.toLowerCase().includes('eliminated')) {
                isParticipating = false
                eliminationOrder = status.match(/Eliminated (\d+)/i)![1]
            }

            const contestant: ITeam = {
                teamName: teamName,
                relationship: element.relationship,
                isParticipating,
                eliminationOrder
            }

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
