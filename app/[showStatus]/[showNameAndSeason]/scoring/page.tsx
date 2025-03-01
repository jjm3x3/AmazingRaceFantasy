import {transformFilenameToSesonNameRepo } from "../../../utils/leagueUtils"
import ContestantSelector from '../../../components/contestantSelector'
import { getCompetingEntityList } from "../../../utils/wikiQuery"
import { getWikipediaContestantDataFetcher } from '../../../utils/wikiFetch'
import generateListOfContestantRoundLists from '../../../generators/contestantRoundListGenerator'

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
      const { urlSlug: showNameAndSeason } = transformFilenameToSesonNameRepo(file)
      // Exporting properties as params
      const showPropertiesObj = {
        showNameAndSeason,
        showStatus: LEAGUE_STATUS
      }
      shows.push(showPropertiesObj);
    });
    return shows;
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
    const { CONTESTANT_LEAGUE_DATA } = await require(`../../../leagueData/${fileName}.js`);
    const { WIKI_API_URL, GOOGLE_SHEET_URL, CAST_PHRASE, PRE_GOOGLE_SHEETS_LINK_TEXT, POST_GOOGLE_SHEETS_LINK_TEXT } = await require(`../../../leagueConfiguration/${fileName}.js`);

    const dataFetcher = getWikipediaContestantDataFetcher(WIKI_API_URL, CAST_PHRASE);
    let listOfContestantRoundLists;

    // Check for Amazing Race due to additional param
    if(showName.match('AmazingRace')){
      listOfContestantRoundLists = await generateListOfContestantRoundLists(dataFetcher, CONTESTANT_LEAGUE_DATA)
    } else {
      listOfContestantRoundLists = await generateListOfContestantRoundLists(dataFetcher, CONTESTANT_LEAGUE_DATA, getCompetingEntityList)
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
