import { getWikipediaContestantDataFetcher } from "@/app/dataSources/wikiFetch";
import { getLeagueConfigurationKeys, getLeagueConfigurationData } from "@/app/dataSources/dbFetch";
import { stripTableHeader } from "@/app/utils/wikiQuery";
import { getParser } from "@/app/utils/entityParserSwitch"
import { getUrlParams } from "@/app/utils/pages";
import { Table } from "@/app/components/baseComponents";
import { TableRowItem } from "@/app/components/baseComponents/models/tableData";

// This forces Next to only generate routes that exist in generateStaticParams, otherwise return a 404
export const dynamicParams = false

// Creates routes for wiki connection status
export async function generateStaticParams() {
    const leagueConfigurationKeys = await getLeagueConfigurationKeys();
    const params = await getUrlParams(leagueConfigurationKeys);
    return params;
}

export default async function WikiConnectionStatus({ params }: {
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
    const dataFetcher = await getWikipediaContestantDataFetcher(wikiApiUrl, castPhrase);
    const wikiTableData = await dataFetcher();
    const wikiContestants = stripTableHeader(wikiTableData);
    const parsingFn = getParser(showName);
    const parsedData = parsingFn(wikiContestants);
    console.log(parsedData)
    const tableColumnNames: TableRowItem[] = [{
        key: "teamName",
        value: "Team Name"
    }, {
        key: "isParticipating",
        value: "Is Participating"
    }, {
        key: "eliminationOrder",
        value: "Elimination Order"
    }];

    const finalTableData = {
        columnNames: tableColumnNames,
        rows: parsedData.map((row) => ({
            teamName: row.teamName,
            isParticipating: row.isParticipating.toString(),
            eliminationOrder: row.eliminationOrder
        }))
    };
    
    return (
        <div>
            <h1 className="text-3xl text-center">Wiki Connection Status</h1>
            <br/>
            <Table tableData={finalTableData}/>
        </div>
    );
}