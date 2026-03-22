import { getWikipediaContestantDataFetcher } from "@/app/dataSources/wikiFetch"
import { Table } from "../../../components/baseComponents";
import { TableData, TableRowItem } from "../../../components/baseComponents/models/tableData";
import { getParser } from "@/app/utils/entityParserSwitch"
import { getLeagueConfigurationKeys, getLeagueConfigurationData } from "@/app/dataSources/dbFetch";
import { getUrlParams } from "@/app/utils/pages";
import { stripTableHeader } from "@/app/utils/wikiQuery";
import League from "@/app/models/League";

interface ContestantRoundData {
    name: string,
    roundScore: number,
    totalScore: number
}

interface TableDataItem {
    round: number,
    contestantRoundData: ContestantRoundData[]
}

// This forces Next to only generate routes that exist in generateStaticParams, otherwise return a 404
export const dynamicParams = false

// Creates routes for scoring
export async function generateStaticParams() {
    const leagueConfigurationKeys = await getLeagueConfigurationKeys();
    const params = await getUrlParams(leagueConfigurationKeys);
    return params;
}

export default async function ShowDetails({ params }: {
    params: Promise<{ showStatus: string; showNameAndSeason: string }>
  }) {
    // Wait for parsing and retrieving params
    const { showNameAndSeason, showStatus } = await params;
    // Formatting to file naming convention
    const showAndSeasonArr = showNameAndSeason.split("-");
    const showSeason = showAndSeasonArr.at(-1);
    showAndSeasonArr.pop();
    const showName = showAndSeasonArr.join("_");
    // "Dynamically" (still static site generated) retrieving modules
    const leagueConfigurationData = await getLeagueConfigurationData(`league_configuration:${showStatus}:${showName}:${showSeason}`);
    const { wikiApiUrl, castPhrase } = leagueConfigurationData;
    const fetchedData = getWikipediaContestantDataFetcher(wikiApiUrl, castPhrase);
    const wikiTableData = await fetchedData();
    const wikiContestants = stripTableHeader(wikiTableData);
    const parsingFn = getParser(showName);
    const pageData = parsingFn(wikiContestants);
    const tableColumnNames: string[] = ["Team Name", "Is Participating", "Elimination Order"];
    const tableRows = pageData.map((team) => {
        
    });
    const tableData: TableData = {
        columnNames: tableColumnNames,
        rows: []
    };

    return (
        <div>
            <h1 className="text-3xl text-center">Show Details</h1>
            <br/>
            {/* <Table tableData={tableData} /> */}
        </div>
    );
}