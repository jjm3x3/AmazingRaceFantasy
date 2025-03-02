import * as pagesModule from "./pages";
const path = require("path");
const fs = require("fs");
import { transformFilenameToSeasonNameRepo } from "./leagueUtils"

interface ILeagueLink {
    name: string
    subpages: IPage[]
}

interface IPage {
    name: string
    path: string
}

export function getPathsToMap (){
    const pathToLeagueData = path.join(process.cwd(), "app", "leagueConfiguration");
    const pathsToMap = fs.readdirSync(pathToLeagueData);
    return pathsToMap;
}

export function getConfigurationPage (filename:string){
    return require(`../leagueConfiguration/${filename}`);
}

export function checkForSubpages (filename:string){
    return fs.existsSync(path.join(process.cwd(), "app", "leagueData", filename));
}

export function getPages(): ILeagueLink[] {
    // Based on availability in leagueConfiguration
    const filepaths = pagesModule.getPathsToMap();
    const activeLeaguePaths:Array<ILeagueLink> = [];
    const archiveLeaguePaths:Array<ILeagueLink> = [];
    filepaths.map((file: string) => {
        // Needed status for url
        const { LEAGUE_STATUS } = pagesModule.getConfigurationPage(file);
        // Parses filename and converts it to url format
        const pageStrings = transformFilenameToSeasonNameRepo(file);
        const subpages:Array<IPage> = [];
        subpages.push({
            name: "Contestants",
            path: `/${LEAGUE_STATUS}/${pageStrings.urlSlug}/contestants`
        });
        if(pagesModule.checkForSubpages(file)){
            const scoringSubpage = {
                name: "Scoring",
                path: `/${LEAGUE_STATUS}/${pageStrings.urlSlug}/scoring`
            }
            const leagueStandingSubpage = {
                name: "League Standing",
                path: `/${LEAGUE_STATUS}/${pageStrings.urlSlug}/league-standing`
            }
            subpages.push(scoringSubpage, leagueStandingSubpage);
        }
        if(LEAGUE_STATUS === "active"){
            pageStrings.friendlyName = `Current (${pageStrings.friendlyName})`
        }
        //   Path object created
        const pathObj = {
            name: pageStrings.friendlyName,
            subpages: subpages
        }
        if(LEAGUE_STATUS === "active"){
            activeLeaguePaths.push(pathObj);
        } else {
            archiveLeaguePaths.push(pathObj);
        }
    });
    const paths:Array<ILeagueLink> = activeLeaguePaths.concat(archiveLeaguePaths);
    return paths;
}

