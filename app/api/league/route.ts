import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client, TokenPayload } from "google-auth-library";

export async function POST(request: NextRequest) {
    // check auth
    const body = await request.json();
    if (!body.token) {
        return NextResponse.json({"error": "you are not authenticated with this service"}, {status: 401})
    }
    const client = new OAuth2Client();
    const clientId = process.env.GOOGLE_LOGIN_CLIENT_ID;
    let authResponse = null;
    authResponse = await client.verifyIdToken({
        idToken: body.token,
        audience: clientId
    });

    // validate/sanitize input

    // insert into db

    // return
    return NextResponse.json({"message": "posted"});
}
