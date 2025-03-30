import { getLeagueConfigurationKeys, getContestantData, IContestantData } from "../dataSources/dbFetch";

interface ILeagueLink {
    name: string
    subpages: IPage[]
}

interface IPage {
    name: string
    path: string
}

interface PageInformation {
    showStatus: string, 
    showNameAndSeason: string,
    friendlyName: string
}

function constructPageInformation(leagueConfigurationKey:string){
    const showKey = leagueConfigurationKey.replace("league_configuration:", "");
    const params = showKey.replaceAll("_", "-").split(":");
    const showStatus = params.find(param => param === "active" || param === "archive");
    const showNameAndSeason = params.filter(param => param !== "active" && param !== "archive").join("-");
    const friendlyShowName = params[1].split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    const friendlyName = `${friendlyShowName} ${params[2]}`;
    const contestantDataKey = `${showKey.replace(/(archive|active):/i, "")}:*`;
    return {
        contestantDataKey,
        showStatus,
        showNameAndSeason,
        friendlyName
    }
}

function generateSubpages (pageInformation:PageInformation, showContestantData:IContestantData[]){
    const subpages:Array<IPage> = [];
    subpages.push({
        name: "Contestants",
        path: `/${pageInformation.showStatus}/${pageInformation.showNameAndSeason}/contestants`
    });
    const hasContestantInfo = showContestantData.length;
    if(hasContestantInfo){
        const scoringSubpage = {
            name: "Scoring",
            path: `/${pageInformation.showStatus}/${pageInformation.showNameAndSeason}/scoring`
        }
        const leagueStandingSubpage = {
            name: "League Standing",
            path: `/${pageInformation.showStatus}/${pageInformation.showNameAndSeason}/league-standing`
        }
        subpages.push(scoringSubpage, leagueStandingSubpage);
    }
    return subpages;
}

export async function getPages(): Promise<ILeagueLink[]> {
    // Based on availability in leagueConfiguration
    const leagueConfigurationKeys = await getLeagueConfigurationKeys();
    const activeLeaguePaths:Array<ILeagueLink> = [];
    const archiveLeaguePaths:Array<ILeagueLink> = [];
    for(const leagueConfigurationKey of leagueConfigurationKeys){
        const pageInformation = constructPageInformation(leagueConfigurationKey);
        const showContestantData = await getContestantData(pageInformation.contestantDataKey);
        const subpages:Array<IPage> = generateSubpages(pageInformation, showContestantData);
        if(pageInformation.showStatus === "active"){
            pageInformation.friendlyName = `Current (${pageInformation.friendlyName})`
        }
        const pathObj = {
            name: pageInformation.friendlyName,
            subpages: subpages
        }
        if(pageInformation.showStatus === "active"){
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

