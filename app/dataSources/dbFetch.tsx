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

export interface GoogleUserData {
    googleUserId: string
    userId?: string
}

export interface IUserData {
    role?: string
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

export async function hasContestantData(keyPrefix:string): Promise<boolean>  {
    if (keyPrefix === undefined) {
        throw new Error("Unable to getContestantData. Provided param 'keySpace' is undefined but must have a value\"");
    }
    const redis = new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN
    });
    const userCursor = await redis.scan("0", {match: keyPrefix});
    const userLeagueKeys = userCursor[1] // get's the list of keys in the cursor
    return userLeagueKeys.length > 0 ? true : false;
}

export async function getLeagueConfigurationKeys(): Promise<string[]> {
    const leagueConfigurationKeys = await getAllKeys("league_configuration:*")

    if(leagueConfigurationKeys !== null){
        return leagueConfigurationKeys;
    } else {
        throw new Error("There are no league configurations in the database");
    }
}

export async function writeLeagueConfigurationData(leagueConfigurationKey: string, leagueConfiguration: ILeagueConfigurationData): Promise<void> {

    if (leagueConfigurationKey === undefined) {
        throw new Error("Unable to writeLeagueConfigurationData. Provided param 'leagueConfigurationKey' is undefined but must have a value\"");
    };
    if (leagueConfiguration === undefined) {
        throw new Error("Unable to writeLeagueConfigurationData. Provided param 'leagueConfiguration' is undefined but must have a value\"");
    };

    const redis = new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN
    });

    const leagueConfigString = JSON.stringify(leagueConfiguration)

    await redis.json.set(leagueConfigurationKey, "$", leagueConfigString)
}

export async function getLeagueConfigurationData(leagueConfigurationKey: string): Promise<ILeagueConfigurationData> {

    if (leagueConfigurationKey === undefined) {
        throw new Error("Unable to getLeagueConfigurationData. Provided param 'leagueConfigurationKey' is undefined but must have a value\"");
    }

    const redis = new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN
    })
    const leagueConfigurationData: ILeagueConfigurationData | null = await redis.json.get(leagueConfigurationKey);
    if (leagueConfigurationData !== null){
        return leagueConfigurationData;
    } else {
        throw new Error("There is no league configuration found for the key provided");
    }
}

export async function writeGoogleUserData (googleUserId: string){
    const redisOptions = {
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN
    };
    const redis = new Redis(redisOptions);

    // Post to DB
    const userDbObj = { googleUserId }
    const leagueConfigString = JSON.stringify(userDbObj)
    await redis.json.set(`user:${googleUserId}`, "$", leagueConfigString)
}

export async function writeGoogleUserDataWithId (userDbObj: GoogleUserData){
    const redisOptions = {
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN
    };
    const redis = new Redis(redisOptions);

    // Post to DB
    const leagueConfigString = JSON.stringify(userDbObj)
    await redis.json.set(`user:${userDbObj.googleUserId}`, "$", leagueConfigString)
}

export async function getAllKeys(keyPrefix: string): Promise<string[]> {

    const redis = new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN
    });

    let allKeysCursor = await redis.scan("0", {match: keyPrefix});
    let allKeysResults = allKeysCursor[1];
    let cursorStart = allKeysCursor[0];
    while(cursorStart !== "0"){
        allKeysCursor = await redis.scan(cursorStart, {match: keyPrefix});
        allKeysResults = allKeysResults.concat(allKeysCursor[1]);
        cursorStart = allKeysCursor[0];
    }

    return allKeysResults;
}

export async function getGoogleUser(googleUserId: string): Promise<GoogleUserData | null> {

    if (googleUserId === undefined) {
        throw new Error("Unable to getGoogleUser. Provided param 'googleUserId' is undefined but must have a value");
    }

    try {
        const jsonResult = await getJson<GoogleUserData>(`user:${googleUserId}`);
        return jsonResult;
    } catch (_error){
        return null;
    }
}

export async function getUser(userId: string): Promise<IUserData> {

    if (userId === undefined) {
        throw new Error("Unable to getUser. Provided param 'googleUserId' is undefined but must have a value");
    }

    return getJson<IuserData>(`internal_user:${userId}`);
}

export async function getJson<T>(key: string): Promise<T> {

    if (key === undefined) {
        throw new Error("Unable to getJson. Provided param 'key' is undefined but must have a value\"");
    }

    const redis = new Redis({
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN
    })
    const jsonResult: T | null = await redis.json.get(key);
    if (jsonResult !== null){
        return jsonResult;
    } else {
        throw new Error("There is no json found for the key provided");
    }
}

