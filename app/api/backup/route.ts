import { NextRequest, NextResponse } from "next/server";
import * as S3 from "@aws-sdk/client-s3";

const AWS_REGION = process.env.AWS_REGION;

const s3Client = new S3.S3Client({
    region: AWS_REGION
});

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

    return NextResponse.json({ success: true });
}
