import ContestantSelector from "../../../components/contestantSelector"
import { getCompetingEntityList } from "../../../utils/wikiQuery"
import parseAmazingRaceEntities from "@/app/parsers/amazingRaceEntityParser";
import { getWikipediaContestantDataFetcher } from "../../../dataSources/wikiFetch"
import generateListOfContestantRoundLists from "../../../generators/contestantRoundListGenerator"
import { getContestantData, getLeagueConfigurationKeys, getLeagueConfigurationData } from "@/app/dataSources/dbFetch"
import { getUrlParams } from "@/app/utils/pages"

// This forces Next to only generate routes that exist in generateStaticParams, otherwise return a 404
export const dynamicParams = false

// Creates routes for scoring
export async function generateStaticParams() {
    const leagueConfigurationKeys = await getLeagueConfigurationKeys();
    const params = await getUrlParams(leagueConfigurationKeys);
    return params;
}

export default async function Scoring({ params }: {
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
    const { wikiApiUrl, googleSheetUrl, castPhrase, preGoogleSheetsLinkText, postGoogleSheetsLinkText, contestantLeagueDataKeyPrefix } = leagueConfigurationData;

    const dataFetcher = getWikipediaContestantDataFetcher(wikiApiUrl, castPhrase);
    let listOfContestantRoundLists;

    const contestantRoundData = await getContestantData(contestantLeagueDataKeyPrefix);

    // Check for Amazing Race due to additional param
    if(showName.match("amazing_race")){
        listOfContestantRoundLists = await generateListOfContestantRoundLists(dataFetcher, contestantRoundData, parseAmazingRaceEntities)
    } else {
        listOfContestantRoundLists = await generateListOfContestantRoundLists(dataFetcher, contestantRoundData, getCompetingEntityList)
    }

    return (
        <div>
            <h1 className="text-2xl text-center">Scoring For</h1>
            <br/>
            <ContestantSelector listOfContestantRoundLists={listOfContestantRoundLists}/>
            {/* Only render if Google Sheet link is present */}
            {googleSheetUrl.length > 0 && <p>{preGoogleSheetsLinkText} <a className="standard-link" href={googleSheetUrl}>this google sheet</a> {postGoogleSheetsLinkText}</p>}
            <br/>
        </div>
    )
}
