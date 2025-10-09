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

scanKeyspace(keyspace, async (key) => {
    console.log(`Readding config for key: '${key}' from prod`);
    const pointReadResult = await readonlyProdRedis.json.get(key)
    console.log(`Read prod config for '${key}'`);
    await writeRedis.json.set(key, "$", pointReadResult);
    console.log(`Wrote config for key: '${key}' to dev`);
});

async function scanKeyspace(keyspace, processKey) {
    let fullCursor = await readonlyProdRedis.scan("0", {match: keyspace})
    await handleScanResult(fullCursor, processKey);
    
    let nextId = fullCursor[0]
    while (nextId != 0) {
        console.log(`Fetching next scan batch with id: '${nextId}`)
        fullCursor = await readonlyProdRedis.scan(nextId, {match: keyspace})
        await handleScanResult(fullCursor, processKey);
        nextId = fullCursor[0]
    }
}

async function handleScanResult(scanResult, handleKey) {
    const scanKeys = scanResult[1];
    await Promise.all(scanKeys.map((key) => { handleKey(key) }));
}

