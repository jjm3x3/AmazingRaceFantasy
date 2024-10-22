import fs from 'fs';
import { cwd } from 'process';
import { join } from 'path';

interface ILeagueLink {
    name: string
    subpages: IPage[]
}

interface IPage {
    name: string
    path: string
}

export function getPages(): ILeagueLink[] {
    const appLevelDir = join(cwd(), 'app');
    const currentDirFilesList = fs.readdirSync(appLevelDir);
    let archiveDirFilesList: string[] = []
    const currentBBLeague = "big-brother-26"
    const currentSurvivorLeague = "survivor-47"
    const pages: ILeagueLink[] = [
        {
            name: 'Current (Survivor)',
            subpages: [{
                name: 'Contestants',
                path: "/active/" + currentSurvivorLeague + "/contestants"
            }]
        },
        {
            name: 'Current (Big Brother)',
            subpages: [{
                name: 'Contestants',
                path: "/active/" + currentBBLeague + "/contestants"
            }, {
                name: 'Scoring',
                path: "/active/" + currentBBLeague + "/scoring"
            }]
        }
    ];

    if (currentDirFilesList.includes("archive")) {
        archiveDirFilesList = fs.readdirSync(join(appLevelDir,"archive"));
    }
    archiveDirFilesList.map(s => {
        const friendlyName = s.replaceAll("-", " ")
        // TODO capitalize show name
        const contestantsPath = "/archive/" + s + "/contestants"
        const scoringPath = "/archive/" + s + "/scoring"
        const leagueStandingPath = "/archive/" + s + "/league-standing"
        const pageObj: ILeagueLink = {
            name: friendlyName,
            subpages: [{
                name: 'Contestants',
                path: contestantsPath
            },{
                name: 'Scoring',
                path: scoringPath
            }, {
                name: 'League Standing',
                path: leagueStandingPath
            }]
        }
        pages.push(pageObj);
        return pages;
    });
    return pages;
}
