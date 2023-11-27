import * as cheerio from 'cheerio'

export const wikiUrl = "https://en.wikipedia.org/wiki/The_Amazing_Race_35"

interface IWikipediaData {
    parse: {
        text: string
    }
}

async function fetchWikipediaData(): Promise<IWikipediaData> {
    const apiUrl = 'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=The_Amazing_Race_35&section=7&formatversion=2'
    const response = await fetch(apiUrl)
    const data = await response.json()
    return data
}

async function getCheerioQuery(): Promise<any> {

    const htmlsnippet = wikipediadata.parse.text
    const cheerioQuery  = cheerio.load(htmlsnippet)
    const cheerioFilter = cheerioQuery('table.wikitable tbody tr')

    return cheerioFilter
}
