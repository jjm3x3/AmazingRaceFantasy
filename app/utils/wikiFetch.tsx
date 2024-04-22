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

interface Section {
    toclevel: number
    level: string
    line: string
    number: string
    index: string
    fromtitle: string
    byteoffset: number
    anchor: string
    linkAnchor: string
}

interface ParseResult {
    title: string
    pageid: number
    sections: Section[]
    showtoc: boolean
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

async function fetchWikipediaSections(wikiUrl: string): Promise<ParseResult> {
    const response = await fetch(wikiUrl)
    const data = await response.json()
    return data.parse
}

function findSectionIndexByAnchor(sections: Section[], anchor: string): number | undefined {
    for (const section of sections) {
        if (section.anchor === anchor) {
            return parseInt(section.index, 10)
        }
    }
    return undefined;
}

export async function getWikipediaContestantData(wikiUrl: string): Promise<IWikipediaContestantData[]> {

    const sectionsUrl =`${wikiUrl}&prop=sections&formatversion=2`
    const sectionsData = await fetchWikipediaSections(sectionsUrl)
    const sections  = sectionsData.sections
    const sectionIndex = findSectionIndexByAnchor(sections, "Cast")
    const castUrl = `${wikiUrl}&section=${sectionIndex}&formatversion=2`

    const wikipediaData = await fetchWikipediaData(castUrl)
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

