import { getLeagueConfigurationKeys, hasContestantData } from "../dataSources/dbFetch";

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
    friendlyName: string,
    contestantDataKey: string
}

// Example leagueConfigurationKey value: league_configuration:active:big_brother:26
function constructPageInformation(leagueConfigurationKey:string){
    const showKey = leagueConfigurationKey.replace("league_configuration:", "");
    const params = showKey.replaceAll("_", "-").split(":");
    const showStatus = params[0];
    const showNameAndSeason = `${params[1]}-${params[2]}`;
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

function generateContestantSubpage(pageInformation:PageInformation){
    const subpages:Array<IPage> = [];
    subpages.push({
        name: "Contestants",
        path: `/${pageInformation.showStatus}/${pageInformation.showNameAndSeason}/contestants`
    });
    return subpages;
}

function generateScoringAndLeagueSubpages(pageInformation:PageInformation){
    const subpages:Array<IPage> = [];
    const scoringSubpage = {
        name: "Scoring",
        path: `/${pageInformation.showStatus}/${pageInformation.showNameAndSeason}/scoring`
    }
    const leagueStandingSubpage = {
        name: "League Standing",
        path: `/${pageInformation.showStatus}/${pageInformation.showNameAndSeason}/league-standing`
    }
    subpages.push(scoringSubpage, leagueStandingSubpage);
    return subpages;
}

function generatePathObj(pageData:PageInformation, subpages: Array<IPage>){
    if(pageData.showStatus === "active"){
        pageData.friendlyName = `Current (${pageData.friendlyName})`
    }
    return {
        name: pageData.friendlyName,
        subpages: subpages
    }
}

export async function getPages(): Promise<ILeagueLink[]> {
    // Based on availability in leagueConfiguration
    const leagueConfigurationKeys = await getLeagueConfigurationKeys();
    const activeLeaguePaths:Array<ILeagueLink> = [];
    const archiveLeaguePaths:Array<ILeagueLink> = [];
    for(const leagueConfigurationKey of leagueConfigurationKeys){
        const pageData: PageInformation = constructPageInformation(leagueConfigurationKey);
        const contestantDataExists = await hasContestantData(pageData.contestantDataKey);
        let subpages:Array<IPage> = generateContestantSubpage(pageData);
        if(contestantDataExists){
            const contestantDataExistsSubpages:Array<IPage> = generateScoringAndLeagueSubpages(pageData);
            subpages = subpages.concat(contestantDataExistsSubpages);
        }
        const pathObj = generatePathObj(pageData, subpages);
        if(pageData.showStatus === "active"){
            pageData.friendlyName = `Current (${pageData.friendlyName})`
            activeLeaguePaths.push(pathObj);
        } else {
            archiveLeaguePaths.push(pathObj);
        }
    }
    const paths:Array<ILeagueLink> = [...activeLeaguePaths,...archiveLeaguePaths];
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

