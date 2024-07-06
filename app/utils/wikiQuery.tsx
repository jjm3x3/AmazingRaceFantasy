import { ITableRowData } from './wikiFetch'
import Team from '../models/Team'

export interface ITeam {
    teamName: string
    relationship: string
    isParticipating: boolean
    eliminationOrder: number
}

export function getTeamList(contestantData :ITableRowData[]): any {

    const contestants: ITeam[] = []

    let firstContestantFound: boolean = false
    let teamStarted: boolean = false

    contestantData.forEach((element, index) => {

        const status = element.col4
        let teamName = element.name

        if (status === null || status === undefined) {
            throw new ReferenceError("Status is either null or undefined and it should not be")
        }

        if (!firstContestantFound && isPartialContestantData(element)) {
            return
        }

        if (!teamStarted) {
            let isParticipating = true
            let eliminationOrder = 0
            firstContestantFound = true

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
                relationship: element.col2,
                isParticipating,
                eliminationOrder
            })

            if (contestant.teamName) {
                contestants.push(contestant)    
                teamStarted = true
            } else {
                console.warn("Found a null contestant Name...")    
            }
        } else {
            if (!isPartialContestantData(element)) {
                contestants[contestants.length-1].teamName += " & " + teamName 
                teamStarted = false
            }
        }
    })

    return { props: { runners: contestants }}
}

export function isPartialContestantData(contestantRowData: ITableRowData): boolean {
    // Admittedly this is probably a moving target and may come with the baggage
    // of a doubleNegative since we are often using this as a filter, The idea
    // is this should return true if we are lacking the necessary/sufficent data
    // to create a showcontestnat.
    return (contestantRowData.name == null || contestantRowData.name === "") && (!contestantRowData.name2 || !contestantRowData.col2)
}

export function getCompetingEntityList(contestantData :ITableRowData[]): any {

    const contestants: CompetingEntity[] = []

    contestantData.forEach((element, index) => {

        console.log(element)
        let status = null
        if (element.col5){
            status = element.col5 // help with navigating entry day wirdnes
        } else {
            status = element.col4
        }
        console.log("status is: " + status)
        let teamName = element.name || element.name2

        if (status === null || status === undefined) {
            throw new ReferenceError("Status is either null or undefined and it should not be")
        }

        let isParticipating = true
        let eliminationOrder = 0

        // for amazing-race
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
        // for big-brother

        const contestant: Team = new Team({
            teamName: teamName,
            relationship: element.col2,
            isParticipating,
            eliminationOrder
        })

        if (contestant.teamName) {
            contestants.push(contestant)
        } else {
            console.warn("Found a null contestant Name...")
        }
    })

    return { props: { runners: contestants }}
}

