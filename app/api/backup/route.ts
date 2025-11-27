import { NextRequest, NextResponse } from "next/server";
import * as S3 from "@aws-sdk/client-s3";
import { awsCredentialsProvider } from "@vercel/oidc-aws-credentials-provider";

const AWS_REGION = process.env.AWS_REGION;
const AWS_ROLE_ARN = process.env.AWS_ROLE_ARN;
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

const s3Client = new S3.S3Client({
    region: AWS_REGION,
    credentials: awsCredentialsProvider({
        roleArn: AWS_ROLE_ARN
    })
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

    const result = await s3Client.send(
        new S3.PutObjectCommand({
            Bucket: S3_BUCKET_NAME,
            Key: "test",
            Body: "some text in a file..."
        })
    );

    console.log(result);

    return NextResponse.json({ success: true });
}
