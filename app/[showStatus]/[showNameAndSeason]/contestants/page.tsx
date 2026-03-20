import styles from "./contestantsPage.module.scss";
import { parseEntities } from "@/app/utils/entityParserSwitch"
import { getWikipediaContestantData } from "../../../dataSources/wikiFetch";
import { getLeagueConfigurationData, getLeagueConfigurationKeys, getContestantData } from "@/app/dataSources/dbFetch";
import { getUrlParams } from "@/app/utils/pages";
import TeamListWithToggle from "./teamListWithToggle";
// This forces Next to only generate routes that exist in generateStaticParams, otherwise return a 404
export const dynamicParams = false


// Creates routes for scoring
export async function generateStaticParams() {
    const leagueConfigurationKeys = await getLeagueConfigurationKeys();
    const params = await getUrlParams(leagueConfigurationKeys);
    return params;
}

export default async function Contestants({ params }: {
    params: Promise<{ showStatus: string; showNameAndSeason: string }>
  }) {
    // Wait for parsing and retrieving params
    const { showNameAndSeason, showStatus } = await params;
    // Formatting to file naming convention
    const showAndSeasonArr = showNameAndSeason.split("-");
    const showSeason = showAndSeasonArr.at(-1);
    showAndSeasonArr.pop();
    const showName = showAndSeasonArr.join("_");
    const friendlyShowName = showAndSeasonArr.join(" ");
    // "Dynamically" (still static site generated) retrieving modules
    const leagueConfigurationData = await getLeagueConfigurationData(`league_configuration:${showStatus}:${showName}:${showSeason}`);
    const { wikiApiUrl, wikiPageUrl, castPhrase, competitingEntityName, contestantLeagueDataKeyPrefix } = leagueConfigurationData;

    const wikiContestants = await getWikipediaContestantData(wikiApiUrl, castPhrase);

    const final = parseEntities(wikiContestants, showName);
    const randomizedContestants = [...final].sort(() => Math.random() - 0.5);
    // This is a workaround to ensure the data is serializable and can be passed to a client-side component.
    // To understand better, see: https://stackoverflow.com/questions/77091418/warning-only-plain-objects-can-be-passed-to-client-components-from-server-compo
    const parsedFinal = JSON.parse(JSON.stringify(randomizedContestants));
    const contestantRoundData = await getContestantData(contestantLeagueDataKeyPrefix);

    return (
        <div className={styles.contestantsPageContainer}>
            <h1 className="text-2xl text-center">Contestants</h1>
            <p className={`text-lg text-center ${styles.contestantsCount}`}>{parsedFinal.length} {competitingEntityName}</p>
            <TeamListWithToggle playerData={contestantRoundData} contestantsData={parsedFinal}/>
            <div>
                <p>
                    Data provided by <a className="standard-link" href={wikiPageUrl}>Wikipedia</a> for this season of {friendlyShowName}
                </p>
            </div>
        </div>
    );
}

