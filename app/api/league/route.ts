import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import * as z from "zod/v4";

const unauthenticatedErrorMessage = "you are not authenticated with this service";
const validLeagueStatuses = ["active","archive"];

const LeagueConfig = z.object({
    wikiPageName: z.string(),
    googleSheetUrl: z.string(),
    leagueStatus: z.enum(validLeagueStatuses)
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

    try {
        LeagueConfig.parse(requestBodyJson);
    }
    catch(error){
        const firstIssue = error.issues[0];
        return NextResponse.json({"error": `parsing error caught by zod parsing, first one being ${firstIssue}`}, {status: 400});
    }

    // insert into db

    // return
    return NextResponse.json({"message": "posted"});
}
