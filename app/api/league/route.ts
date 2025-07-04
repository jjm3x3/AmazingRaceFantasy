import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client, TokenPayload } from "google-auth-library";

const unauthenticatedErrorMessage = "you are not authenticated with this service";

export async function POST(request: NextRequest) {
    // check auth
    const body = await request.json();
    if (!body.token) {
        return NextResponse.json({"error": unauthenticatedErrorMessage}, {status: 401})
    }
    const client = new OAuth2Client();
    const clientId = process.env.GOOGLE_LOGIN_CLIENT_ID;
    let authResponse = null;
    try {
        authResponse = await client.verifyIdToken({
            idToken: body.token,
            audience: clientId
        });
    }
    catch(error) {
    }

    // validate/sanitize input

    // insert into db

    // return
    return NextResponse.json({"message": "posted"});
}
