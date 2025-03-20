import { transformFilenameToSeasonNameRepo } from "../../../utils/leagueUtils"
import { getWikipediaContestantDataFetcher } from "@/app/dataSources/wikiFetch"
import LeagueStandingTable from "../../../components/leagueStandingTable/leagueStandingTable";
import { getTeamList, getCompetingEntityList } from "@/app/utils/wikiQuery";
import { generateContestantRoundScores } from "@/app/generators/contestantRoundScoreGenerator";
import { getContestantData } from "@/app/dataSources/dbFetch";
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

export default async function LeagueStanding({ params }: {
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
    const { wikiApiUrl, castPhrase, contestantLeagueDataKeyPrefix } = leagueConfigurationData;
    const dataFetcher = getWikipediaContestantDataFetcher(wikiApiUrl, castPhrase);
    const contestantRoundData = await getContestantData(contestantLeagueDataKeyPrefix);

    const getEntityFn = showName.match("AmazingRace") ? getTeamList : getCompetingEntityList;
    
    const contestantsScores = await generateContestantRoundScores(dataFetcher, getEntityFn, contestantRoundData);
    return (
        <div>
            <h1 className="text-3xl text-center">League Standing</h1>
            <br/>
            <LeagueStandingTable contestantsScores={contestantsScores.rounds} />
        </div>
    );
}

