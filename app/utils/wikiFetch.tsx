import * as cheerio from 'cheerio'

interface IWikipediaData {
    parse: {
        text: string
    }
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

export interface ITableRowData {
    name: string
    name2: string
    col1: string
    col2: string
    col3: string
    col4: string
    col5: string
}

async function fetchWikipediaData(wikiUrl: string): Promise<IWikipediaData> {
    const response = await fetch(wikiUrl, { next: { revalidate: 3600 } })
    const data = await response.json()
    return data
}

export function getWikipediaContestantDataFetcher(wikiUrl: string, contestantSectionName: string): () => Promise<ITableRowData[]> {
    return async function() {
        return await getWikipediaContestantData(wikiUrl, contestantSectionName)
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

export async function getWikipediaContestantData(wikiUrl: string, contestantSectionName: string): Promise<ITableRowData[]> {

    const sectionsUrl =`${wikiUrl}&prop=sections&formatversion=2`
    const sectionsData = await fetchWikipediaSections(sectionsUrl)
    const sections  = sectionsData.sections
    const sectionIndex = findSectionIndexByAnchor(sections, contestantSectionName)
    const castUrl = `${wikiUrl}&section=${sectionIndex}&formatversion=2`

    const wikipediaData = await fetchWikipediaData(castUrl)
    const htmlsnippet = wikipediaData.parse.text
    const $ = cheerio.load(htmlsnippet)
    const cheerioFilter = $('table.wikitable tbody tr')


    const contestantData = cheerioFilter.map((index, element) => {

        const $row =  $(element)

        const name = $row.find('th span.fn').text().trim()
        const name2 = $row.find('th').text().trim()
        const col1 = $row.find('td').eq(0).text().trim()
        const col2 = $row.find('td').eq(1).text().trim()
        const col3 = $row.find('td').eq(2).text().trim()
        const col4 = $row.find('td').eq(3).text().trim()
        const col5 = $row.find('td').eq(4).text().trim()

        const aContestant: ITableRowData = {
            name: name,
            name2: name2,
            col1: col1,
            col2: col2,
            col3: col3,
            col4: col4,
            col5: col5
        }

        return aContestant
    }).toArray()

    const result = filterEmptyContestants(contestantData)

    return result
}

export function filterEmptyContestants(contestantList: ITableRowData[]): ITableRowData[] {
    // I believe that the behavior that led to this addition is missing all
    // properties but the name seemed like the most important one for now
    return contestantList.filter(x =>  x.name)
}

