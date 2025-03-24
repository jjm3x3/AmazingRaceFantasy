import { Redis } from "@upstash/redis"

export interface IContestantData {
    name: string
    userId: string
    ranking: string[]
    handicap: number
}

export interface ILeagueConfigurationData {
    wikiPageUrl: string,
    wikiApiUrl: string,
    googleSheetUrl: string,
    leagueStatus: string,
    castPhrase: string,
    preGoogleSheetsLinkText: string,
    postGoogleSheetsLinkText: string,
    competitingEntityName: string,
    contestantLeagueDataKeyPrefix: string
}

export async function getContestantData(keyPrefix: string): Promise<IContestantData[]> {

    if (keyPrefix === undefined) {
        throw new Error("Unable to getContestantData. Provided param 'keySpace' is undefined but must have a value\"");
    }

    const redis = new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN
    })

    const userCursor = await redis.scan("0", {match: keyPrefix})
    const userLeagueKeys = userCursor[1] // get's the list of keys in the cursor
    const userList = []
    for (let i = 0; i < userLeagueKeys.length; i++) {
        const userData: IContestantData | null = await redis.json.get(userLeagueKeys[i])
        if (userData !== null) {
            userList.push(userData);
        }
    }

    return userList
}

export async function getLeagueConfigurationData(leagueConfigurationKey: string): Promise<ILeagueConfigurationData[]> {

    if (leagueConfigurationKey === undefined) {
        throw new Error("Unable to getLeagueConfigurationData. Provided param 'leagueConfigurationKey' is undefined but must have a value\"");
    }

    const redis = new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN
    })

    const leagueConfigurationCursor = await redis.scan("0", {match: leagueConfigurationKey})
    const leagueConfigurationKeys = leagueConfigurationCursor[1] // get's the list of keys in the cursor
    const leagueConfigurationList = []
    for (let i = 0; i < leagueConfigurationKeys.length; i++) {
        const leagueConfigurationData: ILeagueConfigurationData | null = await redis.json.get(leagueConfigurationKeys[i])
        if (leagueConfigurationData !== null) {
            leagueConfigurationList.push(leagueConfigurationData);
        }
    }

    return leagueConfigurationList
}
