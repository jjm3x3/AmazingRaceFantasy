import * as cheerio from 'cheerio'

export const wikiUrl = "https://en.wikipedia.org/wiki/The_Amazing_Race_35"

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
    const apiUrl = 'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=The_Amazing_Race_35&section=7&formatversion=2'
    const response = await fetch(apiUrl)
    const data = await response.json()
    return data
}

async function getCheerioQuery(): Promise<any> {

    const wikipediaData = await fetchWikipediaData()
    const htmlsnippet = wikipediaData.parse.text
    const cheerioQuery  = cheerio.load(htmlsnippet)
    const cheerioFilter = cheerioQuery('table.wikitable tbody tr')


    const contestantData = cheerioFilter.map((index, element) => {

        const $row =  cheerioQuery(element)

        const aContestant = {
            teamName: $row.find('th span.fn').text().trim(),
            age: $row.find('td').eq(0).text().trim(),
            relationship: $row.find('td').eq(1).text().trim(),
            hometown: $row.find('td').eq(2).text().trim(),
            status: $row.find('td').eq(3).text().trim()
        }

        return aContestant
    })

    return contestantData
}
