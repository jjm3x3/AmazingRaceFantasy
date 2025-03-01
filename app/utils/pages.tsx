import fs from "fs";
import { cwd } from "process";
import { join } from "path";

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
    const fs = require('fs');
    const path = require('path');
    
    // Based on availability in leagueConfiguration
    const pathToLeagueData = path.join(process.cwd(), 'app', 'leagueConfiguration');
    const activeLeaguePaths:Array<ILeagueLink> = [];
    const archiveLeaguePaths:Array<ILeagueLink> = [];
    fs.readdirSync(pathToLeagueData).map((file: string) => {
      // Needed status for url
      const { LEAGUE_STATUS } = require(`../leagueConfiguration/${file}`);
      // Parses filename and converts it to url format
      const showAndSeason = file.split('_');
      const showNameArray = showAndSeason[0].split(/(?<![A-Z])(?=[A-Z])/);
      const showNameFormatted = showNameArray.join('-').toLowerCase();
      const showSeason = showAndSeason[1].replace('.js', '');
      const showNameAndSeason = `${showNameFormatted}-${showSeason}`;
      let friendlyName = `${showNameArray.join(' ')} ${showSeason}`;
      const contestantSubpage = {
        name: "Contestants",
        path: `/${LEAGUE_STATUS}/${showNameAndSeason}/contestants`
      }
      const subpages = [contestantSubpage];
      if(fs.existsSync(path.join(process.cwd(), 'app', 'leagueData', file))){
        const leagueStandingSubpage = {
            name: "League Standing",
            path: `/${LEAGUE_STATUS}/${showNameAndSeason}/league-standing`
        }
        const scoringSubpage = {
            name: "Scoring",
            path: `/${LEAGUE_STATUS}/${showNameAndSeason}/scoring`
        }
        subpages.push(leagueStandingSubpage, scoringSubpage);
      }
        if(LEAGUE_STATUS === 'active'){
            friendlyName = `Current (${friendlyName})`
        }
        //   Path object created
        const pathObj = {
            name: friendlyName,
            subpages: subpages
        }
        if(LEAGUE_STATUS === 'active'){
            activeLeaguePaths.push(pathObj);
        } else {
            archiveLeaguePaths.push(pathObj);
        }
    });
    const paths:Array<ILeagueLink> = activeLeaguePaths.concat(archiveLeaguePaths);
    return paths;
}
