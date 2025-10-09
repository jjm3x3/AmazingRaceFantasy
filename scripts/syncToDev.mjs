import { Redis } from "@upstash/redis"

console.log("Syncing select data from prod");

console.log("Setting up db settings bassed on vars in process.env");
let readonlyProdredisOptions = {
    url: process.env.PROD_KV_REST_API_URL,
    token: process.env.PROD_KV_REST_API_READ_ONLY_TOKEN
};

console.log("Connecting (reader) to: '" + readonlyProdredisOptions.url + "'");

const readonlyProdRedis = new Redis(readonlyProdredisOptions);

let writeRedisOptions = {
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN
};

console.log("Connecting (writer) to: '" + writeRedisOptions.url + "'");

const writeRedis = new Redis(writeRedisOptions)

const keyspace = "league_configuration:*";

//readKeyspace(keyspace);

const pointReadResult = await readonlyProdRedis.json.get("league_configuration:active:survivor:49")

console.log(pointReadResult);

await writeRedis.json.set("league_configuration:active:survivor:49", "$", pointReadResult);


async function readKeyspace(keyspace) {
    let fullCursor = await readonlyProdRedis.scan("0", {match: keyspace})
    console.log(fullCursor)
    
    let nextId = fullCursor[0]
    while (nextId != 0) {
        console.log(`Fetching next scan batch with id: '${nextId}`)
        fullCursor = await readonlyProdRedis.scan(nextId, {match: keyspace})
        console.log(fullCursor)
        nextId = fullCursor[0]
    }
}

async function handleScanResult(scanResult, handleKey) {
    const scanKeys = scanResult[1];
    await Promise.all(scanKeys.map((key) => { handleKey(key) }));
}

