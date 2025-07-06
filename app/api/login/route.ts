import { OAuth2Client, TokenPayload } from "google-auth-library";
import { NextRequest, NextResponse } from "next/server";
import { writeGoogleUserData } from "@/app/dataSources/dbFetch";
import { createSession } from "../session/session";

export async function POST(request: NextRequest) {
    const client = new OAuth2Client();
    const body = await request.json();
    const clientId = process.env.GOOGLE_LOGIN_CLIENT_ID;
    const authResponse = await client.verifyIdToken({
        idToken: body.token,
        audience: clientId
    });
    
    const payload:TokenPayload | undefined = authResponse.getPayload();

    if(payload){
        const googleUserId = payload["sub"];
        writeGoogleUserData (googleUserId);
    
        // Data to send to the front end
        const userObj = {
            email: payload?.email,
            name: {
                firstName: payload?.given_name,
                lastName: payload?.family_name
            }
        }

        const response = NextResponse.json(userObj);
        await createSession({
            response,
            exp: payload.exp,
            session_id: body.token
        });
        
        return response;
    }
}