import * as pagesModule from "./pages";
const path = require("path");

interface ILeagueLink {
    name: string
    subpages: IPage[]
}

interface IPage {
    name: string
    path: string
}

export function getConfigurationPath (){
    return path.join(process.cwd(), "app", "leagueConfiguration");
}

export function getConfigurationPage (filename:string){
    return require(`../leagueConfiguration/${filename}`);
}

export function getDataPath (filename:string){
    return path.join(process.cwd(), "app", "leagueData", filename);
}

export function getPages(): ILeagueLink[] {
    // Necessary Node modules to fetch data
    const fs = require("fs");
    
    // Based on availability in leagueConfiguration
    const pathToLeagueData = pagesModule.getConfigurationPath();
    const activeLeaguePaths:Array<ILeagueLink> = [];
    const archiveLeaguePaths:Array<ILeagueLink> = [];
    fs.readdirSync(pathToLeagueData).map((file: string) => {
        // Needed status for url
        const { LEAGUE_STATUS } = pagesModule.getConfigurationPage(file);
        // Parses filename and converts it to url format
        const showAndSeason = file.split("_");
        const showNameArray = showAndSeason[0].split(/(?<![A-Z])(?=[A-Z])/);
        const showNameFormatted = showNameArray.join("-").toLowerCase();
        const showSeason = showAndSeason[1].replace(".js", "");
        const showNameAndSeason = `${showNameFormatted}-${showSeason}`;
        let friendlyName = `${showNameArray.join(" ")} ${showSeason}`;
        const subpages:Array<IPage> = [];
        subpages.push({
            name: "Contestants",
            path: `/${LEAGUE_STATUS}/${showNameAndSeason}/contestants`
        });
        if(fs.existsSync(pagesModule.getDataPath(file))){
            const scoringSubpage = {
                name: "Scoring",
                path: `/${LEAGUE_STATUS}/${showNameAndSeason}/scoring`
            }
            const leagueStandingSubpage = {
                name: "League Standing",
                path: `/${LEAGUE_STATUS}/${showNameAndSeason}/league-standing`
            }
            subpages.push(scoringSubpage, leagueStandingSubpage);
        }
        if(LEAGUE_STATUS === "active"){
            friendlyName = `Current (${friendlyName})`
        }
        //   Path object created
        const pathObj = {
            name: friendlyName,
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
