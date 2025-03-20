import * as pagesModule from "./pages";
import fs from "fs";
import path from "path";
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

export function getLeagueConfigurationData (filename:string){
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
        const { leagueStatus } = pagesModule.getLeagueConfigurationData(file);
        // Parses filename and converts it to url format
        const pageStrings = transformFilenameToSeasonNameRepo(file);
        const subpages:Array<IPage> = [];
        subpages.push({
            name: "Contestants",
            path: `/${leagueStatus}/${pageStrings.urlSlug}/contestants`
        });
        if(pagesModule.checkForSubpages(file)){
            const scoringSubpage = {
                name: "Scoring",
                path: `/${leagueStatus}/${pageStrings.urlSlug}/scoring`
            }
            const leagueStandingSubpage = {
                name: "League Standing",
                path: `/${leagueStatus}/${pageStrings.urlSlug}/league-standing`
            }
            subpages.push(scoringSubpage, leagueStandingSubpage);
        }
        if(leagueStatus === "active"){
            pageStrings.friendlyName = `Current (${pageStrings.friendlyName})`
        }
        //   Path object created
        const pathObj = {
            name: pageStrings.friendlyName,
            subpages: subpages
        }
        if(leagueStatus === "active"){
            activeLeaguePaths.push(pathObj);
        } else {
            archiveLeaguePaths.push(pathObj);
        }
    });
    const paths:Array<ILeagueLink> = activeLeaguePaths.concat(archiveLeaguePaths);
    return paths;
}

