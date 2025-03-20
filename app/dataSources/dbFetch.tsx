import { Redis } from "@upstash/redis"

export interface IContestantData {
    name: string
    userId: string
    ranking: string[]
    handicap: number
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
