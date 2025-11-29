import { NextRequest, NextResponse } from "next/server";
import { saveObject } from "@/app/dataSources/s3Provider";

const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

export async function GET(request: NextRequest) {
    console.log("cron endpoint hit");

    const authHeader = request.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        console.log("cron caller unathorized");
        return new Response("Unauthorized", {
            status: 401,
        });
    }

    console.log("cron function triggered");

    const result = await saveObject({
        Bucket: S3_BUCKET_NAME,
        Key: "test",
        Body: "some text in a file..."
    });

    console.log(result);

    return NextResponse.json({ success: true });
}
