import { getWikipediaContestantDataFetcher } from "@/app/dataSources/wikiFetch"
import LeagueStandingTable from "../../../components/leagueStandingTable/leagueStandingTable";
import { getTeamList, getCompetingEntityList } from "@/app/utils/wikiQuery";
import { generateContestantRoundScores } from "@/app/generators/contestantRoundScoreGenerator";
import { getContestantData, getLeagueConfigurationKeys } from "@/app/dataSources/dbFetch";
import { getUrlParams } from "@/app/utils/pages";

// This forces Next to only generate routes that exist in generateStaticParams, otherwise return a 404
export const dynamicParams = false

// Creates routes for scoring
export async function generateStaticParams() {
    const leagueConfigurationKeys = await getLeagueConfigurationKeys();
    const params = await getUrlParams(leagueConfigurationKeys);
    return params;
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

