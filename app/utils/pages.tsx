import fs from 'fs';

interface ILeagueLink {
    name: string
    subpages: IPage[]
}

interface IPage {
    name: string
    path: string
}

export function getPages(): ILeagueLink[] {
    const currentDirFilesList = fs.readdirSync(__dirname);
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
            }, {
                name: 'League Standing',
                path: "/active/" + currentBBLeague + "/league-standing"
            }]
        }
    ];

    if (currentDirFilesList.includes("archive")) {
        archiveDirFilesList = fs.readdirSync(__dirname+"/archive")
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
    })
    return pages;
}
