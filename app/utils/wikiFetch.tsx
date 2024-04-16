import * as cheerio from 'cheerio'

interface IWikipediaData {
    parse: {
        text: string
    }
}

export interface IWikipediaContestantData {
    name: string
    age: string
    relationship: string
    hometown: string
    status: string
}

async function fetchWikipediaData(wikiUrl: string): Promise<IWikipediaData> {
    const response = await fetch(wikiUrl, { next: { revalidate: 3600 } })
    const data = await response.json()
    return data
}

export function getWikipediaContestantDataFetcher(wikiUrl: string): () => Promise<IWikipediaContestantData[]> {
    return async function() {
        return await getWikipediaContestantData(wikiUrl)
    }
}

export async function getWikipediaContestantData(wikiUrl: string): Promise<IWikipediaContestantData[]> {

    const wikipediaData = await fetchWikipediaData(wikiUrl)
    const htmlsnippet = wikipediaData.parse.text
    const $ = cheerio.load(htmlsnippet)
    const cheerioFilter = $('table.wikitable tbody tr')


    const contestantData = cheerioFilter.map((index, element) => {

        const $row =  $(element)

        const name = $row.find('th span.fn').text().trim()
        const age = $row.find('td').eq(0).text().trim()
        const relationship = $row.find('td').eq(1).text().trim()
        const hometown = $row.find('td').eq(2).text().trim()
        const status = $row.find('td').eq(3).text().trim()

        const aContestant: IWikipediaContestantData = {
            name: name,
            age: age,
            relationship: relationship,
            hometown: hometown,
            status: status
        }

        return aContestant
    }).toArray()

    const result = filterEmptyContestants(contestantData)

    return result
}

export function filterEmptyContestants(contestantList: IWikipediaContestantData[]): IWikipediaContestantData[] {
    // I believe that the behavior that led to this addition is missing all
    // properties but the name seemed like the most important one for now
    return contestantList.filter(x =>  x.name)
}

