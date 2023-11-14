
import * as cheerio from 'cheerio'

export const wikiUrl = "https://en.wikipedia.org/wiki/The_Amazing_Race_35"

interface IWikipediaData {
    parse: {
        text: string
    }
}

interface Contestant {
    teamName: string
    age: number
    relationship: string
    hometown: string
    isParticipating: boolean
    eliminationOrder: string
}

async function fetchWikipediaData(): Promise<IWikipediaData> {
    const apiUrl = 'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=The_Amazing_Race_35&section=5&formatversion=2'
    const response = await fetch(apiUrl)
    const data = await response.json()
    return data
}

export async function getContestantList(): Promise<any> {

    const wikipediaData = await fetchWikipediaData()
    const htmlSnippet = wikipediaData.parse.text
    const $ = cheerio.load(htmlSnippet)
    const contestants: Contestant[] = []

    $('table.wikitable tbody tr').each((index, element) => {

        const $row = $(element)
        const teamName = $row.find('th span.fn').text().trim()
        const age = parseInt($row.find('td').eq(0).text().trim(), 10)
        const relationship = $row.find('td').eq(1).text().trim()
        const hometown = $row.find('td').eq(2).text().trim()
        const status = $row.find('td').eq(3).text().trim()

        if ( index %2 == 1) {    
            let isParticipating = true
            let eliminationOrder = ''

            if (status.toLowerCase().includes('eliminated')) {
                isParticipating = false
                eliminationOrder = status.match(/Eliminated (\d+)/i)![1]
            }

            const contestant: Contestant = {
                teamName,
                age,
                relationship,
                hometown,
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