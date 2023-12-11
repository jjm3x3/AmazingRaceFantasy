import { IWikipediaContestantData } './wikiFetch'

export interface ITeam {
    teamName: string
    relationship: string
    isParticipating: boolean
    eliminationOrder: string
}

export function getTeamList(contestantData :IWikipediaContestantData[]): any {

    const contestants: IContestant[] = []

    contestantData.each((index, element) => {

        const status = element.status
        let teamName = element.teamName

        if (index % 2 == 1) {
            let isParticipating = true
            let eliminationOrder = ''

            if (status.toLowerCase().includes('eliminated')) {
                isParticipating = false
                eliminationOrder = status.match(/Eliminated (\d+)/i)![1]
            }

            const contestant: IContestant = {
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
