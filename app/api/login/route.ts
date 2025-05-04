import { OAuth2Client } from "google-auth-library";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const client = new OAuth2Client();
    const body = await request.json();
    const clientId = process.env.GOOGLE_LOGIN_CLIENT_ID;
    const authResponse = await client.verifyIdToken({
        idToken: body.token,
        audience: clientId
    });
    const payload = authResponse.getPayload();
    const userObj = {
        email: payload?.email,
        name: {
            firstName: payload?.given_name,
            lastName: payload?.family_name
        }
    }
    return NextResponse.json(userObj);
}