import { getLeagueConfigurationKeys, getContestantData } from "../dataSources/dbFetch";

interface ILeagueLink {
    name: string
    subpages: IPage[]
}

interface IPage {
    name: string
    path: string
}

export async function getPages(): Promise<ILeagueLink[]> {
    // Based on availability in leagueConfiguration
    const leagueConfigurationKeys = await getLeagueConfigurationKeys();
    const activeLeaguePaths:Array<ILeagueLink> = [];
    const archiveLeaguePaths:Array<ILeagueLink> = [];
    for(const leagueConfigurationKey of leagueConfigurationKeys){
        const showKey = leagueConfigurationKey.replace("league_configuration:", "");
        const params = showKey.replaceAll("_", "-").split(":");
        const showStatus = params.find(param => param === "active" || param === "archive");
        const showNameAndSeason = params.filter(param => param !== "active" && param !== "archive").join("-");
        const friendlyShowName = params[1].split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
        let friendlyName = `${friendlyShowName} ${params[2]}`;
        const subpages:Array<IPage> = [];
        subpages.push({
            name: "Contestants",
            path: `/${showStatus}/${showNameAndSeason}/contestants`
        });
        const showContestantData = await getContestantData(`${showKey.replace(/(archive|active):/i, "")}:*`);
        const hasContestantInfo = showContestantData.length;
        if(hasContestantInfo){
            const scoringSubpage = {
                name: "Scoring",
                path: `/${showStatus}/${showNameAndSeason}/scoring`
            }
            const leagueStandingSubpage = {
                name: "League Standing",
                path: `/${showStatus}/${showNameAndSeason}/league-standing`
            }
            subpages.push(scoringSubpage, leagueStandingSubpage);
        }
        if(showStatus === "active"){
            friendlyName = `Current (${friendlyName})`
        }
        const pathObj = {
            name: friendlyName,
            subpages: subpages
        }
        if(showStatus === "active"){
            activeLeaguePaths.push(pathObj);
        } else {
            archiveLeaguePaths.push(pathObj);
        }
    }
    const pathsPromises = [...activeLeaguePaths,...archiveLeaguePaths];
    const paths:Array<ILeagueLink> = await Promise.all(pathsPromises);
    return paths;
}

export function getUrlParams (dataKeys:string[]){
    const shows = [];
    for(const dataKey of dataKeys){
        const params = dataKey.replace("league_configuration:", "").replaceAll("_", "-").split(":");
        const showStatus = params.find((param:string) => param === "active" || param === "archive");
        const showNameAndSeason = params.filter((param:string) => param !== "active" && param !== "archive").join("-");
        const showPropertiesObj = {
            showNameAndSeason,
            showStatus
        }
        shows.push(showPropertiesObj);
    }
    return shows;
}

