import amazingRace35Data from "../app/leagueData/AmazingRace_35.js"
import amazingRace36Data from "../app/leagueData/AmazingRace_36.js"
import { Redis } from "@upstash/redis"

console.log("Seeding the db")

console.log("Connecting to: '" + process.env.KV_REST_API_URL + "'")

const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN
})

await recreateLeagueData("amazing_race:35:", amazingRace35Data)
await recreateLeagueData("amazing_race:36:", amazingRace36Data)

let fullCursor = await redis.scan("0", {match: "*"})
console.log(fullCursor)

let nextId = fullCursor[0]
while (nextId != 0) {
    console.log(`Fetching next scan batch with id: '${nextId}`)
    fullCursor = await redis.scan(nextId, {match: "*"})
    console.log(fullCursor)
    nextId = fullCursor[0]
}

async function recreateLeagueData(leagueKeyPrefix, dataRepo) {

    const userCursor = await redis.scan("0", {match: leagueKeyPrefix+"*"})

    for (const aKey of userCursor[1]) { //list of keys
        redis.del(aKey)
    }

    for(const user of dataRepo.CONTESTANT_LEAGUE_DATA) {
        if (user.userId == null) {
            console.warn(`The user named: '${user.name}'`)
            continue
        }

        console.log("Setting user '" + user.name + "'")

        const userString = JSON.stringify(user)

        await redis.json.set(leagueKeyPrefix+user.userId, "$", userString)
    }
}
