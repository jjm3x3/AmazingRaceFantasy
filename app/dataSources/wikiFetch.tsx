import * as cheerio from "cheerio";

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

interface WikipediaApiResponse {
    error?: { code?: string; info?: string };
    parse?: {
        sections?: Section[];
        text?: string;
    };
}

export interface ITableRowData {
    name: string
    name2: string
    col1: string
    col2: string
    col3: string
    col4: string
    col5: string
    col6: string
    col7: string
}

async function fetchWikipediaData(url: string): Promise<WikipediaApiResponse> {
    const response = await fetch(url, { next: { revalidate: 3600 } });

    if (!response.ok) {
        throw new Error(`Wikipedia request failed (${response.status}) for ${url}`);
    }

    const data = await response.json() as WikipediaApiResponse;

    if (data.error) {
        throw new Error(
            `Wikipedia API error${data.error.code ? ` (${data.error.code})` : ""}: ` +
            `${data.error.info ?? "Unknown API error"}`
        );
    }

    return data;
}

export function getWikipediaContestantDataFetcher(wikiUrl: string, contestantSectionName: string): () => Promise<ITableRowData[]> {
    return async function() {
        return await getWikipediaContestantData(wikiUrl, contestantSectionName);
    };
}

async function fetchWikipediaSections(wikiUrl: string): Promise<ParseResult> {
    const response = await fetch(wikiUrl, { next: { revalidate: 3600 } });
    if (!response.ok) {
        console.error(`There was an non 200 status code (${response.status}) getting wikipedia sections for page: '${wikiUrl}'`);
    }
    const data = await response.json();
    return data.parse;
}

function findSectionIndexByAnchor(sections: Section[], anchor: string): number | undefined {
    for (const section of sections) {
        if (section.anchor === anchor) {
            return parseInt(section.index, 10);
        }
    }
    return undefined;
}

export async function getWikipediaContestantData(wikiUrl: string, contestantSectionName: string): Promise<ITableRowData[]> {

    const sectionsUrl =`${wikiUrl}&prop=sections&formatversion=2`;
    const sectionsData = await fetchWikipediaData(sectionsUrl);
    const sections = sectionsData.parse?.sections;

    if (!sections) {
        throw new Error(`Wikipedia returned no sections for ${wikiUrl}`);
    }

    const sectionIndex = findSectionIndexByAnchor(sections, contestantSectionName);

    if (sectionIndex === undefined) {
        throw new Error(
            `Wikipedia section "${contestantSectionName}" was not found for ${wikiUrl}`
        );
    }

    const castUrl = new URL(wikiUrl);
    castUrl.searchParams.set("section", String(sectionIndex));
    castUrl.searchParams.set("formatversion", "2");

    const wikipediaData = await fetchWikipediaData(castUrl.toString());
    const htmlsnippet = wikipediaData.parse?.text;

    if (typeof htmlsnippet !== "string" || htmlsnippet.length === 0) {
        throw new Error(`Wikipedia returned no section content for "${contestantSectionName}"`);
    }

    const $ = cheerio.load(htmlsnippet);
    const cheerioFilter = $("table.wikitable tbody tr");


    const contestantData = cheerioFilter.map((index, element) => {

        const $row =  $(element);

        const name = $row.find("th span.fn").text().trim();
        const name2 = $row.find("th").text().trim();
        const col1 = $row.find("td").eq(0).text().trim();
        const col2 = $row.find("td").eq(1).text().trim();
        const col3 = $row.find("td").eq(2).text().trim();
        const col4 = $row.find("td").eq(3).text().trim();
        const col5 = $row.find("td").eq(4).text().trim();
        const col6 = $row.find("td").eq(5).text().trim();
        const col7 = $row.find("td").eq(6).text().trim();

        const aContestant: ITableRowData = {
            name: name,
            name2: name2,
            col1: col1,
            col2: col2,
            col3: col3,
            col4: col4,
            col5: col5,
            col6: col6,
            col7: col7
        };

        return aContestant;
    }).toArray();

    return contestantData;
}

