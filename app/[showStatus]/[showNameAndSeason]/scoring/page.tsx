import { transformFilenameToSeasonNameRepo } from "../../../utils/leagueUtils"
import ContestantSelector from '../../../components/contestantSelector'
import { getCompetingEntityList } from "../../../utils/wikiQuery"
import { getWikipediaContestantDataFetcher } from '../../../dataSources/wikiFetch'
import generateListOfContestantRoundLists from '../../../generators/contestantRoundListGenerator'
import { Redis } from "@upstash/redis"

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
      console.log(file);
      console.log(pathToLeagueData)
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

async function getContestantData(keyPrefix: string): Promise<any[]> {

    if (keyPrefix === undefined) {
        throw new Error(`Unable to getContestantData. Provided param 'keySpace' is undefined but must have a value"`);
    }

    const redis = new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN
    })

    const userCursor = await redis.scan("0", {match: keyPrefix})
    const userLeagueKeys = userCursor[1] // get's the list of keys in the cursor
    const userList = []
    for (let i = 0; i < userLeagueKeys.length; i++) {
        const userData = await redis.json.get(userLeagueKeys[i])
        userList.push(userData)
    }

    return userList
}

export default async function Scoring({ params }: {
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
    const { WIKI_API_URL, GOOGLE_SHEET_URL, CAST_PHRASE, PRE_GOOGLE_SHEETS_LINK_TEXT, POST_GOOGLE_SHEETS_LINK_TEXT, CONTESTANT_LEAGUE_DATA_KEY_PREFIX } = await require(`../../../leagueConfiguration/${fileName}.js`);

    const dataFetcher = getWikipediaContestantDataFetcher(WIKI_API_URL, CAST_PHRASE);
    let listOfContestantRoundLists;

    const contestantRoundData = await getContestantData(CONTESTANT_LEAGUE_DATA_KEY_PREFIX);

    // Check for Amazing Race due to additional param
    if(showName.match('AmazingRace')){
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
            {GOOGLE_SHEET_URL.length > 0 && <p>{PRE_GOOGLE_SHEETS_LINK_TEXT} <a className="standard-link" href={GOOGLE_SHEET_URL}>this google sheet</a> {POST_GOOGLE_SHEETS_LINK_TEXT}</p>}
            <br/>
        </div>
    )
}
