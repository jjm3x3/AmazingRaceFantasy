import { ITableRowData } from './wikiFetch'
import Team from '../models/Team'

export interface ITeam {
    teamName: string
    relationship: string
    isParticipating: boolean
    eliminationOrder: number
}

export function getTeamList(contestantData :ITableRowData[], competeAsTeam: boolean): any {

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
            } else if (status.toLowerCase().includes('evicted')) {
                isParticipating = false
                eliminationOrder = (contestantData.length - index);
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
                if(competeAsTeam){
                    teamStarted = true
                }
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

interface BBHouseGuest {
    teamName: string
    relationship: string
    isParticipating: boolean
    exitedDay: number
}

export function getCompetingEntityList(contestantData :ITableRowData[]): any {

    const contestants: BBHouseGuest[] = []
    let previousExitDay: number = 0

    contestantData.forEach((element, index) => {

        if (isPartialContestantData(element)) {
            return
        }

        let status = null
        if (element.col5){
            status = element.col5 // help with navigating entry day wirdnes
        } else {
            status = element.col4
        }
        if (status === null || status === undefined) {
            throw new ReferenceError("Status is either null or undefined and it should not be")
        }
        
        let teamName = element.name || element.name2

        let isParticipating = true
        let eliminationOrder = 0
        let isWinner = false

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
        else if (status.toLowerCase().includes("evicted")) {
            isParticipating = false
            const statusMatches = status.match(/Evicted\W*Day (\d+)/i)
            eliminationOrder = Number(statusMatches![1])
        } else if (status.toLowerCase().includes("expelled")) {
            isParticipating = false
            eliminationOrder = Number(status.match(/ExpelledDay (\d+)/i)![1]) // covers Luke getting booted
        } else if (status.toLowerCase().includes("exited")) {
            isParticipating = false
            eliminationOrder = Number(status.match(/ExitedDay (\d+)/i)![1]) // covers Jared leaving after zombie twist
        } else if (status.toLowerCase().includes("runner-upd")) { // added the d to distinguish from amazing-race
            isParticipating = false
            eliminationOrder = Number(status.match(/Runner-UpDay (\d+)/i)![1]+ ".5") // covers the final person plus adding .5 to distinguish from the last eviction
        } else if (status.toLowerCase().includes("winner")) {
            isWinner = true
        }

        if (eliminationOrder !== 0) {
            // update previousExitDay
            previousExitDay = eliminationOrder
        } else if (!isWinner) {
            // if no eliminationOrder is found set it to the previous exitDay
            isParticipating = true // should probably be false, but when the league starts it will be true
            eliminationOrder = previousExitDay
            const foundContestant = contestants[contestants.length-1]
            if (foundContestant == null) {
                console.debug("found previous contestant to be null")
            } else if (foundContestant.exitedDay === 0) {
                console.debug("previous contestant has not exited yet")
            } else {
                foundContestant.exitedDay = foundContestant.exitedDay + 0.5 // accounts for the default ordering where the person who come first was actually evicted last
            }
        }

        const parsedContestantData = {
            teamName: teamName,
            relationship: element.col2,
            isParticipating,
            exitedDay: eliminationOrder
        }

        contestants.push(parsedContestantData)
    })


    const sortedContestants = contestants.sort(function(a, b){
        return a.exitedDay-b.exitedDay
    })

    let eliminationOrderCounter = 1
    const contestantsWithEliminationOrder = sortedContestants.map(function(contestant) {
        let eliminationOrder = Number.MAX_VALUE
        if (contestant.exitedDay !== 0) {
            eliminationOrder = eliminationOrderCounter
            eliminationOrderCounter++
        }

        return new Team({
            teamName: contestant.teamName,
            relationship: contestant.relationship,
            isParticipating: contestant.isParticipating,
            eliminationOrder
        })
    })

    const contestantsSortedByEliminationOrder = contestantsWithEliminationOrder.sort(function(a, b){
        return a.eliminationOrder-b.eliminationOrder
    })

    return { props: { runners: contestantsSortedByEliminationOrder }}
}

