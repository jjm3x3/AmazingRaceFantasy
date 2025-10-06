import { Redis } from "@upstash/redis"

console.log("Reading the db");

console.log("Setting up db settings bassed on vars in process.env");
let redisOptions = {
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN
};

console.log("Connecting to: '" + redisOptions.url + "'");

const redis = new Redis(redisOptions);

const keyspace = "league_configuration:*";

readKeyspace(keyspace);

const pointReadResult = await redis.json.get("league_configuration:active:survivor:49")

console.log(pointReadResult);


async function readKeyspace(keyspace) {
    let fullCursor = await redis.scan("0", {match: keyspace})
    console.log(fullCursor)

    let nextId = fullCursor[0]
    while (nextId != 0) {
        console.log(`Fetching next scan batch with id: '${nextId}`)
        fullCursor = await redis.scan(nextId, {match: keyspace})
        console.log(fullCursor)
        nextId = fullCursor[0]
    }
}
