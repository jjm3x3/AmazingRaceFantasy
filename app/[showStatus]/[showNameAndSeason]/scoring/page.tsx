import { transformFilenameToSeasonNameRepo } from "../../../utils/leagueUtils"
import ContestantSelector from "../../../components/contestantSelector"
import { getCompetingEntityList } from "../../../utils/wikiQuery"
import { getWikipediaContestantDataFetcher } from "../../../dataSources/wikiFetch"
import generateListOfContestantRoundLists from "../../../generators/contestantRoundListGenerator"
import { getContestantData } from "@/app/dataSources/dbFetch"
import fs from "fs";
import path from "path";

// This forces Next to only generate routes that exist in generateStaticParams, otherwise return a 404
export const dynamicParams = false

// Creates routes for scoring
export async function generateStaticParams() {
    
    // Based on availability in leagueData
    const pathToLeagueData = path.join(process.cwd(), "app", "leagueData");
    const showPropPromises = fs.readdirSync(pathToLeagueData).map(async (file: string) => {
        // Needed status for url
        const leagueConfigurationData = await import(`../../../leagueConfiguration/${file}`);
        const { leagueStatus } = leagueConfigurationData;
        // Parses filename and converts it to url format
        const { urlSlug: showNameAndSeason } = transformFilenameToSeasonNameRepo(file)
        // Exporting properties as params
        const showPropertiesObj = {
            showNameAndSeason,
            showStatus: leagueStatus
        }
        return showPropertiesObj;
    });
    const shows =  await Promise.all(showPropPromises);
    return shows;
}

export default async function Scoring({ params }: {
    params: Promise<{ showStatus: string; showNameAndSeason: string }>
  }) {
    // Wait for parsing and retrieving params
    const { showNameAndSeason } = await params;
    // Formatting to file naming convention
    const showAndSeasonArr = showNameAndSeason.split("-");
    const showSeason = showAndSeasonArr.at(-1);
    showAndSeasonArr.pop();
    const showName = showAndSeasonArr.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("");
    const fileName = `${showName}_${showSeason}`;
    // "Dynamically" (still static site generated) retrieving modules
    const leagueConfigurationData = await import(`../../../leagueConfiguration/${fileName}.js`);
    const { wikiApiUrl, googleSheetUrl, castPhrase, preGoogleSheetsLinkText, postGoogleSheetsLinkText, contestantLeagueDataKeyPrefix } = leagueConfigurationData;

    const dataFetcher = getWikipediaContestantDataFetcher(wikiApiUrl, castPhrase);
    let listOfContestantRoundLists;

    const contestantRoundData = await getContestantData(contestantLeagueDataKeyPrefix);

    // Check for Amazing Race due to additional param
    if(showName.match("AmazingRace")){
        listOfContestantRoundLists = await generateListOfContestantRoundLists(dataFetcher, contestantRoundData)
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
