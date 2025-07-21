import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import * as z from "zod/v4";
import { writeLeagueConfigurationData } from "@/app/dataSources/dbFetch";

const unauthenticatedErrorMessage = "you are not authenticated with this service";
const validLeagueStatuses = ["active","archive"];

const LeagueConfig = z.object({
    wikiPageName: z.string().regex(/^[a-zA-Z()_0-9]+$/),
    googleSheetUrl: z.url({
        protocol: /^https$/,
        hostname: z.regexes.domain
    }),
    leagueStatus: z.enum(validLeagueStatuses),
    wikiSectionHeader: z.string(),
    contestantType: z.string(),
    leagueKey: z.string().regex(/^[a-zA-Z0-9_:]+$/)
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
    try {
        LeagueConfig.parse(body);
    }
    catch(error: unknown){
        if (error instanceof z.ZodError) {
            const firstIssue = error.issues[0];
            return NextResponse.json(
                {"error": `parsing error caught, first one being property: '${String(firstIssue.path[0])}' having issue: '${firstIssue.message}'`},
                {status: 400}
            );
        }
    }

    // insert into db
    const leagueConfigKey = `league_configuration:${body.leagueStatus}:${body.leagueKey}`;
    const leagueConfig = {
        wikiPageUrl: `https://en.wikipedia.org/wiki/${body.wikiPageName}`,
        wikiApiUrl: `https://en.wikipedia.org/w/api.php?action=parse&format=json&page=${body.wikiPageName}`,
        googleSheetUrl: body.googleSheetUrl,
        leagueStatus: body.leagueStatus,
    };

    await writeLeagueConfigurationData(leagueConfigKey, leagueConfig);

    // return
    return NextResponse.json({"message": "posted"});
}
