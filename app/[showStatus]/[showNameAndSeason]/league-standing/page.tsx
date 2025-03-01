import { transformFilenameToSeasonNameRepo } from "../../../utils/leagueUtils"
import { getWikipediaContestantDataFetcher } from "@/app/dataSources/wikiFetch"
import LeagueStandingTable from "../../../components/leagueStandingTable/leagueStandingTable";
import { getTeamList, getCompetingEntityList } from "@/app/utils/wikiQuery";
import { generateContestantRoundScores } from "@/app/generators/contestantRoundScoreGenerator";
import { getContestantData } from "@/app/dataSources/dbFetch"

// This forces Next to only generate routes that exist in generateStaticParams, otherwise return a 404
export const dynamicParams = false

interface showProperties {
  showNameAndSeason: string,
  showStatus: string
}

// Creates routes for scoring
export function generateStaticParams() {
  
    // Necessary Node modules to fetch data
    const fs = require('fs');
    const path = require('path');
    
    // Based on availability in leagueData
    const pathToLeagueData = path.join(process.cwd(), 'app', 'leagueData');
    const shows:Array<showProperties> = [];
    fs.readdirSync(pathToLeagueData).map((file: string) => {
      // Needed status for url
      const { LEAGUE_STATUS } = require(`../../../leagueConfiguration/${file}`);
      // Parses filename and converts it to url format
      const { urlSlug: showNameAndSeason } = transformFilenameToSeasonNameRepo(file)
      // Exporting properties as params
      const showPropertiesObj = {
        showNameAndSeason,
        showStatus: LEAGUE_STATUS
      }
      shows.push(showPropertiesObj);
    });
    return shows;
}

export default async function LeagueStanding({ params }: {
    params: Promise<{ showStatus: string; showNameAndSeason: string }>
  }) {
    // Wait for parsing and retrieving params
    const { showNameAndSeason } = await params;
    // Formatting to file naming convention
    const showAndSeasonArr = showNameAndSeason.split('-');
    const showSeason = showAndSeasonArr.at(-1);
    showAndSeasonArr.pop();
    const showName = showAndSeasonArr.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
    const fileName = `${showName}_${showSeason}`;
    // "Dynamically" (still static site generated) retrieving modules
    const { CONTESTANT_LEAGUE_DATA } = await require(`../../../leagueData/${fileName}.js`);
    const { WIKI_API_URL, CAST_PHRASE, CONTESTANT_LEAGUE_DATA_KEY_PREFIX } = await require(`../../../leagueConfiguration/${fileName}.js`);
    const dataFetcher = getWikipediaContestantDataFetcher(WIKI_API_URL, CAST_PHRASE);
    const contestantRoundData = await getContestantData(CONTESTANT_LEAGUE_DATA_KEY_PREFIX);

    const getEntityFn = showName.match('AmazingRace') ? getTeamList : getCompetingEntityList;
    
    const contestantsScores = await generateContestantRoundScores(dataFetcher, getEntityFn, contestantRoundData);
    return (
        <div>
            <h1 className="text-3xl text-center">League Standing</h1>
            <br/>
            <LeagueStandingTable contestantsScores={contestantsScores.rounds} />
        </div>
    );
}

