import { NextRequest, NextResponse } from "next/server";
import validationPattern from "@/app/dataSources/validationPatterns";
import * as z from "zod/v4";
import { decrypt } from "@/app/api/session/session";
import { writeLeagueConfigurationData } from "@/app/dataSources/dbFetch";

const unauthenticatedErrorMessage = "you are not authenticated with this service";

interface decryptionPayload {
    sub: string,
    iat: number,
    exp: number
}

const LeagueConfig = z.object({
    wikiPageName: validationPattern.wikiPageUrl.zod,
    googleSheetUrl: validationPattern.googleSheetUrl.zod,
    leagueStatus: validationPattern.leagueStatus.zod,
    wikiSectionHeader: validationPattern.wikiSectionHeader.zod,
    contestantType: validationPattern.contestantType.zod,
    leagueKey: validationPattern.leagueKey.zod
});

export async function POST(request: NextRequest) {
    // check auth
    const body = await request.json();
    const sessionCookie = request.cookies.get("session");
    if(sessionCookie){
        const decryptedSessionCookie = await decrypt(sessionCookie?.value) as decryptionPayload;
        const googleUserId = decryptedSessionCookie?.sub;
        const invalidGoogleUserId = !googleUserId
        const invalidGoogleUserSub = Object.keys(decryptedSessionCookie).length !== 3;
        if (invalidGoogleUserId || invalidGoogleUserSub ) {
            return NextResponse.json({"error": unauthenticatedErrorMessage}, {status: 401});
        }
        const allowedGoogleUserIds = ["108251633753098119380", "117801378252057178101", "104157773450824616168"];
        const isUserDenied = allowedGoogleUserIds.indexOf(googleUserId) < 0;
        if(isUserDenied){
            return NextResponse.json({"error": "you are not authorized to perform that action"}, {status: 403})
        }
    } else {
        return NextResponse.json({"error": unauthenticatedErrorMessage}, {status: 401})
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
        castPhrase: body.wikiSectionHeader,
        preGoogleSheetsLinkText: "This season's contestant data has been sourced from",
        postGoogleSheetsLinkText: "which was populated using a google form.",
        competitingEntityName: body.contestantType,
        contestantLeagueDataKeyPrefix: `${body.leagueKey}:*`
    };

    await writeLeagueConfigurationData(leagueConfigKey, leagueConfig);

    // return
    return NextResponse.json({"message": "posted"});
}
