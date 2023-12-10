
import * as cheerio from 'cheerio'

export const wikiUrl = "https://en.wikipedia.org/wiki/The_Amazing_Race_35"

interface IWikipediaData {
    parse: {
        text: string
    }
}

export interface IContestant {
    teamName: string
    age: number
    relationship: string
    hometown: string
    isParticipating: boolean
    eliminationOrder: string
}

async function fetchWikipediaData(): Promise<IWikipediaData> {
    const apiUrl = 'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=The_Amazing_Race_35&section=7&formatversion=2'
    const response = await fetch(apiUrl)
    const data = await response.json()
    return data
}

export async function getContestantList(contestantData :IWikipediaContestantData[]): Promise<any> {

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
                age: Number(element.age),
                relationship: element.relationship,
                hometown: element.hometown,
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
