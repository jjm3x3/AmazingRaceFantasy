import ContestantSelector from '../../../components/contestantSelector'
import { getCompetingEntityList } from "../../../utils/wikiQuery"
import { getWikipediaContestantDataFetcher } from '../../../utils/wikiFetch'
import generateListOfContestantRoundLists from '../../../generators/contestantRoundListGenerator'

interface showProperties {
  showNameAndSeason: string,
  showStatus: string
}

// Creates routes for scoring
export async function generateStaticParams() {
  
    // Necessary Node modules to fetch data
    const fs = require('fs');
    const path = require('path');
    
    // Based on availability in leagueData
    const pathToLeagueData = path.join(process.cwd(), 'app', 'leagueData');
    const shows:Array<showProperties> = [];
    await fs.readdirSync(pathToLeagueData).forEach(async (file: string) => {
      // Needed status for url
      const { LEAGUE_STATUS } = await require(`../../../leagueConfiguration/${file.replace('.js', '.tsx')}`);
      // Parses filename and converts it to url format
      const showAndSeason = file.split('_');
      const showNameFormatted = showAndSeason[0].split(/(?<![A-Z])(?=[A-Z])/).join('-').toLowerCase();
      const showSeason = showAndSeason[1].replace('.js', '');
      const showNameAndSeason = `${showNameFormatted}-${showSeason}`;
      // Exporting properties as params
      const showPropertiesObj = {
        showNameAndSeason,
        showStatus: LEAGUE_STATUS
      }
      await shows.push(showPropertiesObj);
    });
    return shows;
}

export default async function Scoring({ params }: {
    params: Promise<{ showStatus: string, showAndSeason: string }>
  }) {
    // Wait for parsing and retrieving params
    const { showAndSeason } = await params;
    // Formatting to file naming convention
    const showAndSeasonArr = showAndSeason.split('-');
    const showSeason = showAndSeasonArr[showAndSeasonArr.length - 1];
    showAndSeasonArr.pop();
    const showName = showAndSeasonArr.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('');
    const fileName = `${showName}_${showSeason}`;
    // "Dynamically" (still static site generated) retrieving modules
    const { CONTESTANT_LEAGUE_DATA } = await require(`../../../leagueData/${fileName}.js`);
    const { WIKI_API_URL, GOOGLE_SHEET_URL, CAST_PHRASE } = await require(`../../../leagueConfiguration/${fileName}.tsx`);

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
            {GOOGLE_SHEET_URL.length > 0 && <p>This season's contestant data has been sourced from <a className="standard-link" href={GOOGLE_SHEET_URL}>this google sheet</a> which was populated using a google form.</p>}
            <br/>
        </div>
    )
}
