interface ILeagueLink {
    name: string
    subpages: IPage[]
}

interface IPage {
    name: string
    path: string
}

export function getPages(): ILeagueLink[] {
    // Necessary Node modules to fetch data
    const fs = require("fs");
    const path = require("path");
    
    // Based on availability in leagueConfiguration
    const pathToLeagueData = path.join(process.cwd(), "app", "leagueConfiguration");
    const activeLeaguePaths:Array<ILeagueLink> = [];
    const archiveLeaguePaths:Array<ILeagueLink> = [];
    fs.readdirSync(pathToLeagueData).map((file: string) => {
        // Needed status for url
        const { LEAGUE_STATUS } = require(`../leagueConfiguration/${file}`);
        // Parses filename and converts it to url format
        const pageStrings = transformFilenameToSesonNameRepo(file);
        const subpages:Array<IPage> = [];
        subpages.push({
            name: "Contestants",
            path: `/${LEAGUE_STATUS}/${pageStrings.urlSlug}/contestants`
        });
        if(fs.existsSync(path.join(process.cwd(), 'app', 'leagueData', file))){
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
        if(LEAGUE_STATUS === 'active'){
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

interface SeasonNameRepo {
    urlSlug: string
    friendlyName: string
}

function transformFilenameToSesonNameRepo(fileName: string): SeasonNameRepo {
    const showAndSeason = fileName.split('_');
    const showNameArray = showAndSeason[0].split(/(?<![A-Z])(?=[A-Z])/);
    const showNameFormatted = showNameArray.join('-').toLowerCase();
    const showSeason = showAndSeason[1].replace('.js', '');
    const showNameAndSeason = `${showNameFormatted}-${showSeason}`;
    let friendlyName = `${showNameArray.join(' ')} ${showSeason}`;

    return { urlSlug: showNameAndSeason, friendlyName: friendlyName }
}

