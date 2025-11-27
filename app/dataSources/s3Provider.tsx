import * as S3 from "@aws-sdk/client-s3";
import { awsCredentialsProvider } from "@vercel/oidc-aws-credentials-provider";

const AWS_REGION = process.env.AWS_REGION;
// doing both typing the local and coalescing to capture the type checking as
// early as possible
const AWS_ROLE_ARN: string = process.env.AWS_ROLE_ARN ?? "PlaceholderARN";

const s3Client = new S3.S3Client({
    region: AWS_REGION,
    credentials: awsCredentialsProvider({
        roleArn: AWS_ROLE_ARN
    })
});

export async function saveObject(putCommandObject) {
    return await s3Client.send(
        new S3.PutObjectCommand(putCommandObject)
    );
}
