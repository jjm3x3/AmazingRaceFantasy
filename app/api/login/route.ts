import { OAuth2Client, TokenPayload } from "google-auth-library";
import { NextRequest, NextResponse } from "next/server";
import { writeGoogleUserData } from "@/app/dataSources/dbFetch";
import { createSession } from "../session/session";
import { unauthenticatedErrorMessage } from "@/app/api/constants/errors";

export async function POST(request: NextRequest) {
    const client = new OAuth2Client();
    const body = await request.json();
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

    if(payload){
        const googleUserId = payload["sub"];
        writeGoogleUserData (googleUserId);
    
        // Data to send to the front end
        const userObj = {
            email: payload?.email,
            name: {
                firstName: payload?.given_name,
                lastName: payload?.family_name
            },
            googleUserId: googleUserId
        }

        const response = NextResponse.json(userObj);
        await createSession({
            envelope: body.envelope, 
            exp: payload.exp,
            iat: payload.iat, 
            sub: googleUserId,
            response
        });
        
        return response;
    }
}
