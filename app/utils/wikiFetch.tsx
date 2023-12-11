import * as cheerio from 'cheerio'

export const wikiUrl = "https://en.wikipedia.org/wiki/The_Amazing_Race_35"
const apiUrl = "https://en.wikipedia.org/w/api.php?action=parse&format=json&page=The_Amazing_Race_35&section=7&formatversion=2"

interface IWikipediaData {
    parse: {
        text: string
    }
}

interface IWikipediaContestantData {
    name: string
    age: string
    relationship: string
    hometown: string
    status: string
}

async function fetchWikipediaData(): Promise<IWikipediaData> {
    const response = await fetch(apiUrl)
    const data = await response.json()
    return data
}

export async function getWikipediaContestantData(): Promise<IWikipediaContestantData[]> {

    const wikipediaData = await fetchWikipediaData()
    const htmlsnippet = wikipediaData.parse.text
    const $ = cheerio.load(htmlsnippet)
    const cheerioFilter = $('table.wikitable tbody tr')


    const contestantData = cheerioFilter.map((index, element) => {

        const $row =  $(element)

        const aContestant: IWikipediaContestantData = {
            name: $row.find('th span.fn').text().trim(),
            age: $row.find('td').eq(0).text().trim(),
            relationship: $row.find('td').eq(1).text().trim(),
            hometown: $row.find('td').eq(2).text().trim(),
            status: $row.find('td').eq(3).text().trim()
        }

        return aContestant
    }).toArray()

    return contestantData
}
