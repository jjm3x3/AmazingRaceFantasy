import { transformFilenameToSeasonNameRepo } from "../../../utils/leagueUtils"
import { getCompetingEntityList, getTeamList, ITeam } from "../../../utils/wikiQuery";
import { getWikipediaContestantData } from "../../../dataSources/wikiFetch";

// This forces Next to only generate routes that exist in generateStaticParams, otherwise return a 404
export const dynamicParams = false

interface showProperties {
  showNameAndSeason: string,
  showStatus: string
}

// Creates routes for scoring
export function generateStaticParams() {
  
    // Necessary Node modules to fetch data
    const fs = require("fs");
    const path = require("path");
    
    // Based on availability in leagueConfiguration
    const pathToLeagueConfiguration = path.join(process.cwd(), "app", "leagueConfiguration");
    const shows:Array<showProperties> = [];
    fs.readdirSync(pathToLeagueConfiguration).map((file: string) => {
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

export default async function Contestants({ params }: {
    params: Promise<{ showStatus: string; showNameAndSeason: string }>
  }) {

    // Wait for parsing and retrieving params
    const { showNameAndSeason } = await params;
    // Formatting to file naming convention
    const showAndSeasonArr = showNameAndSeason.split("-");
    const showSeason = showAndSeasonArr.at(-1);
    showAndSeasonArr.pop();
    const showNameArr = showAndSeasonArr.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
    const showName = showNameArr.join("");
    const friendlyShowName = showNameArr.join(" ");
    const fileName = `${showName}_${showSeason}`;
    // "Dynamically" (still static site generated) retrieving modules
    const { WIKI_API_URL, WIKI_PAGE_URL, CAST_PHRASE, COMPETING_ENTITY_NAME } = await require(`../../../leagueConfiguration/${fileName}.js`);

    const wikiContestants = await getWikipediaContestantData(WIKI_API_URL, CAST_PHRASE);
    let final;
    if(showName.match("AmazingRace")){
        final = getTeamList(wikiContestants);
    } else {
        final = getCompetingEntityList(wikiContestants);
    }

    return (
        <div>
            <br/>
            <h1 className="text-2xl text-center">Contestants</h1>
            <br/>
            <p className="text-lg text-center">{final.props.runners.length} {COMPETING_ENTITY_NAME}</p>
            <br/>
            <div className="text-center">
                {final.props.runners.map((t: ITeam) => {
                    return (<>
                        <p key={t.teamName}>
                            {t.isParticipating ? t.teamName : <s>{t.teamName}</s>}
                        </p>
                    </>);
                })}
            </div>
            <br/>
            <div>
                <p>
                    Data provided by <a className="standard-link" href={WIKI_PAGE_URL} >Wikipedia</a> for this season of {friendlyShowName}
                </p>
            </div>
        </div>
    );
}

