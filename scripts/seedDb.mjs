import { CONTESTANT_LEAGUE_DATA } from "../app/leagueData/AmazingRace_35.js";
import { Redis } from "@upstash/redis";

console.log("Seeding the db");

console.log("Connecting to: '" + process.env.KV_REST_API_URL + "'");

const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN
});

const userCursor = await redis.scan("0", {match: "amazing_race:35:*"})

for (const aKey of userCursor[1]) { //list of keys
    redis.del(aKey)
}

for(const user of CONTESTANT_LEAGUE_DATA) {
    if (user.userId == null) {
        console.warn(`The user named: '${user.name}'`)
        continue
    }

    console.log("Setting user '" + user.name + "'")

    const userString = JSON.stringify(user)

    await redis.json.set("amazing_race:35:"+user.userId, "$", userString)
}

const fullCursor = await redis.scan("0", {match: "*"})
console.log(fullCursor)
