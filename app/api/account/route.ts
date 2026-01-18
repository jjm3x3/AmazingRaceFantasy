import { randomUUID } from "crypto";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { NextRequest, NextResponse } from "next/server";
import { getUser,writeGoogleUserDataWithId } from "@/app/dataSources/dbFetch";
import { createSession } from "@/app/api/session/session";
import { unauthenticatedErrorMessage, badGatewayErrorMessage, missingBodyErrorMessage, malformedBodyErrorMessage } from "@/app/api/constants/errors";

export async function POST(request: NextRequest) {
    const client = new OAuth2Client();
    const body = await request.json();
    if(!body.token){
        return NextResponse.json({"error": missingBodyErrorMessage}, {status: 400});
    } else if (body.token.trim() === "" || (/^[0-9a-zA-Z=-_.]+$/).test(body.token) === false){
        return NextResponse.json({"error": malformedBodyErrorMessage}, {status: 400});
    }
    const clientId = process.env.GOOGLE_LOGIN_CLIENT_ID;
    let authResponse = null;
    try {
        authResponse = await client.verifyIdToken({
            idToken: body.token,
            audience: clientId
        });
    } catch (authError) {
        console.warn(`Issue verifying google identity ${authError}`);

        return NextResponse.json({"error": unauthenticatedErrorMessage}, {status: 401});
    }
    
    const payload:TokenPayload | undefined = authResponse !== null ? authResponse.getPayload() : undefined;

    if(!payload){
        return NextResponse.json({ "error": badGatewayErrorMessage }, { status: 502 });
    }
    const googleUserId = payload["sub"];
    // Check if user already exists with googleUserId
    const existingGoogleUser = await getUser(googleUserId);
    if (existingGoogleUser){
        return NextResponse.json({"error": "User already exists with the provided google user id"}, {status: 409});
    }
    const uuid = randomUUID();
    const userDbObj = {
        googleUserId: googleUserId,
        userId: uuid
    }
    writeGoogleUserDataWithId(userDbObj);

    // Data to send to the front end
    const userObjForClient = {
        email: payload?.email,
        name: {
            firstName: payload?.given_name,
            lastName: payload?.family_name
        },
        googleUserId: googleUserId,
        userId: uuid
    }
    const response = NextResponse.json(userObjForClient);
    await createSession({
        envelope: body.envelope, 
        exp: payload.exp,
        iat: payload.iat, 
        sub: uuid,
        response
    });
    return response;
}
