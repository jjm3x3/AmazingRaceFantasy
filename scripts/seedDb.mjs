import amazingRace35Data from "../app/leagueData/AmazingRace_35.js"
import amazingRace36Data from "../app/leagueData/AmazingRace_36.js"
import amazingRace37Data from "../app/leagueData/AmazingRace_37.js"
import bigBrother26Data from "../app/leagueData/BigBrother_26.js"
import bigBrother27Data from "../app/leagueData/BigBrother_27.js"
import survivor47Data from "../app/leagueData/Survivor_47.js"
import amazingRace35LeagueConfiguration from "../app/leagueConfiguration/AmazingRace_35.js"
import amazingRace36LeagueConfiguration from "../app/leagueConfiguration/AmazingRace_36.js"
import amazingRace37LeagueConfiguration from "../app/leagueConfiguration/AmazingRace_37.js"
import bigBrother26LeagueConfiguration from "../app/leagueConfiguration/BigBrother_26.js"
import bigBrother27LeagueConfiguration from "../app/leagueConfiguration/BigBrother_27.js"
import survivor47LeagueConfiguration from "../app/leagueConfiguration/Survivor_47.js"
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
await recreateLeagueData("big_brother:26:", bigBrother26Data)
await recreateLeagueData("big_brother:27:", bigBrother27Data)
await recreateLeagueData("survivor:47:", survivor47Data)

// Create league configuration data
await recreateLeagueConfigurationData(`league_configuration:${amazingRace35LeagueConfiguration.leagueStatus}:amazing_race:35`, amazingRace35LeagueConfiguration)
await recreateLeagueConfigurationData(`league_configuration:${amazingRace36LeagueConfiguration.leagueStatus}:amazing_race:36`, amazingRace36LeagueConfiguration)
await recreateLeagueConfigurationData(`league_configuration:${amazingRace37LeagueConfiguration.leagueStatus}:amazing_race:37`, amazingRace37LeagueConfiguration)
await recreateLeagueConfigurationData(`league_configuration:${bigBrother26LeagueConfiguration.leagueStatus}:big_brother:26`, bigBrother26LeagueConfiguration)
await recreateLeagueConfigurationData(`league_configuration:${bigBrother27LeagueConfiguration.leagueStatus}:big_brother:27`, bigBrother27LeagueConfiguration)
await recreateLeagueConfigurationData(`league_configuration:${survivor47LeagueConfiguration.leagueStatus}:survivor:47`, survivor47LeagueConfiguration)

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


async function recreateLeagueConfigurationData(leagueConfigurationKey, dataRepo) {

    console.log(`Setting league configuration data for '${leagueConfigurationKey}'`);
    
    const leagueConfigString = JSON.stringify(dataRepo)
    
    await redis.json.set(leagueConfigurationKey, "$", leagueConfigString)
}

async function deleteAllLeagueConfigurationData() {
    let leagueConfigurationCursor = await redis.scan("0", {match: "league_configuration:*"});
    let leagueConfigurationKeys = leagueConfigurationCursor[1];
    let cursorStart = leagueConfigurationCursor[0];
    while(cursorStart !== "0"){
        leagueConfigurationCursor = await redis.scan(cursorStart, {match: "league_configuration:*"});
        leagueConfigurationKeys = leagueConfigurationKeys.concat(leagueConfigurationCursor[1]);
        cursorStart = leagueConfigurationCursor[0];
    }
    for(const leagueConfigurationKey of leagueConfigurationKeys){
        redis.del(leagueConfigurationKey);
    }
}
