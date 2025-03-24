import { getCompetingEntityList, getTeamList } from "../../../utils/wikiQuery";
import { getWikipediaContestantData } from "../../../dataSources/wikiFetch";
import { getLeagueConfigurationData } from "@/app/dataSources/dbFetch";
import Team from "@/app/models/Team"
import fs from "fs";
import path from "path";

// This forces Next to only generate routes that exist in generateStaticParams, otherwise return a 404
export const dynamicParams = false


// Creates routes for scoring
export async function generateStaticParams() {
  
    // Based on availability in leagueConfiguration
    const leagueConfigurations = await getLeagueConfigurationData("league_configuration:*");
    const shows = [];
    for(const leagueConfigurationData of leagueConfigurations){
        const { leagueStatus, contestantLeagueDataKeyPrefix} = leagueConfigurationData;
        const showNameAndSeason = contestantLeagueDataKeyPrefix.replace(":*", "").replaceAll("_", "-").replace(":", "-");
        const showPropertiesObj = {
            showNameAndSeason,
            showStatus: leagueStatus
        }
        shows.push(showPropertiesObj);
    }
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
    const leagueConfigurationData = await import(`../../../leagueConfiguration/${fileName}.js`);
    const { wikiApiUrl, wikiPageUrl, castPhrase, competitingEntityName } = leagueConfigurationData;

    const wikiContestants = await getWikipediaContestantData(wikiApiUrl, castPhrase);
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
            <p className="text-lg text-center">{final.length} {competitingEntityName}</p>
            <br/>
            <div className="text-center">
                {final.map((t: Team) => {
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
                    Data provided by <a className="standard-link" href={wikiPageUrl} >Wikipedia</a> for this season of {friendlyShowName}
                </p>
            </div>
        </div>
    );
}

