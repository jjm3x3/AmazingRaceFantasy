import { NextRequest, NextResponse } from "next/server";
import { getAllKeys, getJson } from "@/app/dataSources/dbFetch";
import { saveObject } from "@/app/dataSources/s3Provider";

// doing both typing the local and coalescing to capture the type checking as
// early as possible
const S3_BUCKET_NAME: string = process.env.S3_BUCKET_NAME ?? "bucketNamePlaceholder";

export async function GET(request: NextRequest) {
    console.log("cron endpoint hit");

    const authHeader = request.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        console.log("cron caller unathorized");
        return new Response("Unauthorized", {
            status: 401,
        });
    }

    const currentTimeString = new Date(Date.now()).toJSON();
    console.log(`cron function triggered at ${currentTimeString}`);

    const dbKeys = await getAllKeys("*");

    const keyPromises = dbKeys.map(k => getAndSaveKeyValue(k));

    try {
        // check to make sure all are finished before proceeding
        await Promise.all(keyPromises);
    } catch(error) {
        console.error(`Error backing up all keys to the db: ${error}`);
    }

    const result = await saveObject({
        Bucket: S3_BUCKET_NAME,
        Key: "LastTrigger.txt",
        Body: `some text in a file... at time ${currentTimeString}`
    });

    console.log(result);

    return NextResponse.json({ success: true });
}

async function getAndSaveKeyValue(key: string): Promise {

    const aJson = await getJson(key);

    const jsonString = JSON.stringify(aJson);

    const result = await saveObject({
        Bucket: S3_BUCKET_NAME,
        Key: `${key}`,
        Body: jsonString
    });

    return result;
}
