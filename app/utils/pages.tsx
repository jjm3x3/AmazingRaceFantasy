import fs from 'fs';

export function getPages(source: string) {

    console.log("getPages running for: " + source)
    const currentDirFilesList = fs.readdirSync(__dirname);
    console.log("Call readdirSync: " + currentDirFilesList)
    let archiveDirFilesList: string[] = []
    const pages = [{
        name: 'Current',
        subpages: [{
            name: 'Contestants',
            path: '/contestants'
        }, {
            name: 'Scoring',
            path: '/scoring'
        }, {
            name: 'League Standing',
            path: '/league-standing'
        }]
    }];

    if (currentDirFilesList.includes("archive")) {
        archiveDirFilesList = fs.readdirSync(__dirname+"/archive")
    }
    archiveDirFilesList.map(s => {
        const friendlyName = s.replaceAll("-", " ")
        // TODO capitalize show name
        const contestantsPath = "/archive/" + s + "/contestants"
        const scoringPath = "/archive/" + s + "/scoring"
        const leagueStandingPath = "/archive/" + s + "/league-standing"
        const pageObj = {
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
