import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import * as z from "zod/v4";

const unauthenticatedErrorMessage = "you are not authenticated with this service";

const LeagueConfig = z.object({
    wikiPageName: z.string(),
    googleSheetUrl: z.string(),
    leagueStatus: z.string()
});

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
        console.log(error);
        return NextResponse.json({"error": unauthenticatedErrorMessage}, {status: 401})
    }

    const payload:TokenPayload | undefined = authResponse.getPayload();

    if(payload){
        const googleUserId = payload["sub"];
        if (googleUserId !== "108251633753098119380") {
            return NextResponse.json({"error": "you are not authorized to perform that action"}, {status: 403});
        }
    }

    // validate/sanitize input
    const requestBodyJson = await request.json()
    if (!requestBodyJson.wikiPageName) {
        return NextResponse.json({"error": "Missing required field wikiPageName"}, { status: 400});
    }
    if (!requestBodyJson.googleSheetUrl) {
        return NextResponse.json({"error": "Missing required field googleSheetUrl"}, { status: 400});
    }
    if (!requestBodyJson.leagueStatus) {
        return NextResponse.json({"error": "Missing required field leagueStatus"}, { status: 400});
    }
    const validStatuses = ["active","archive"];
    if (!validStatuses.includes(requestBodyJson.leagueStatus)) {
        return NextResponse.json({"error": `Required field leagueStatus must have a valid status in [${validStatuses}]`}, { status: 400});
    }


    // insert into db

    // return
    return NextResponse.json({"message": "posted"});
}
