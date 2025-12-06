import amazingRace35Data from "../app/leagueData/AmazingRace_35.js"
import amazingRace36Data from "../app/leagueData/AmazingRace_36.js"
import amazingRace37Data from "../app/leagueData/AmazingRace_37.js"
import amazingRace38Data from "../app/leagueData/AmazingRace_38.js"
import bigBrother26Data from "../app/leagueData/BigBrother_26.js"
import bigBrother27Data from "../app/leagueData/BigBrother_27.js"
import survivor47Data from "../app/leagueData/Survivor_47.js"
import survivor49Data from "../app/leagueData/Survivor_49.js"
//import amazingRace37LeagueConfiguration from "../app/leagueConfiguration/AmazingRace_37.js"
import { Redis } from "@upstash/redis"

console.log("Seeding the db");

console.log("Setting up db settings bassed on vars in process.env");
let redisOptions = {
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN
};

console.log("Connecting to: '" + redisOptions.url + "'");

const redis = new Redis(redisOptions);

// Create user data
await recreateLeagueData("amazing_race:35:", amazingRace35Data)
await recreateLeagueData("amazing_race:36:", amazingRace36Data)
await recreateLeagueData("amazing_race:37:", amazingRace37Data)
await recreateLeagueData("amazing_race:38:", amazingRace38Data)
await recreateLeagueData("big_brother:26:", bigBrother26Data)
await recreateLeagueData("big_brother:27:", bigBrother27Data)
await recreateLeagueData("survivor:47:", survivor47Data)
await recreateLeagueData("survivor:49:", survivor49Data)

// Create league configuration data
// Note: leaving this commented out code, should we need to add another config
//     this way, otherwise new league configs should be added using the
//     league/configuration page instead.
//await recreateLeagueConfigurationData(`league_configuration:${amazingRace37LeagueConfiguration.leagueStatus}:amazing_race:37`, amazingRace37LeagueConfiguration)

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
            console.warn(`Cannot insert user to league: '${leagueKeyPrefix}' with name: '${user.name}', they are missing a userId`)
            continue
        }

        console.log(`Setting user to league '${leagueKeyPrefix}' with name: '${user.name}'`)

        const userString = JSON.stringify(user)

        await redis.json.set(leagueKeyPrefix+user.userId, "$", userString)
    }
}


async function _recreateLeagueConfigurationData(leagueConfigurationKey, dataRepo) {

    console.log(`Setting league configuration data for '${leagueConfigurationKey}'`);
    
    const leagueConfigString = JSON.stringify(dataRepo)
    
    await redis.json.set(leagueConfigurationKey, "$", leagueConfigString)
}

