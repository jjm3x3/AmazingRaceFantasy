import { NextRequest, NextResponse } from "next/server";
import validationPattern from "@/app/dataSources/validationPatterns";
import * as z from "zod/v4";
import { decrypt } from "@/app/api/session/session";
import { getUser, writeLeagueConfigurationData, ILeagueConfigurationData } from "@/app/dataSources/dbFetch";
import { unauthenticatedErrorMessage } from "@/app/api/constants/errors";

interface decryptionPayload {
    sub: string,
    iat: number,
    exp: number
}

const LeagueConfigUpdate = z.object({
    wikiPageUrl: validationPattern.wikiPageUrl.zod,
    wikiApiUrl: validationPattern.wikiPageUrl.zod,
    googleSheetUrl: validationPattern.googleSheetUrl.zod,
    leagueStatus: validationPattern.leagueStatus.zod,
    castPhrase: validationPattern.contestantType.zod,
    preGoogleSheetsLinkText: z.string(),
    postGoogleSheetsLinkText: z.string(),
    competitingEntityName: validationPattern.contestantType.zod,
    contestantLeagueDataKeyPrefix: z.string(),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ leagueKey: string }> }) {
    const { leagueKey } = await params;
    const leagueConfigurationKey = `league_configuration:${leagueKey}`;

    // check auth
    const body = await request.json();
    const sessionCookie = request.cookies.get("session");
    let userId: string | undefined;
    if(sessionCookie){
        const decryptedSessionCookie = await decrypt(sessionCookie?.value) as decryptionPayload;
        userId = decryptedSessionCookie?.sub;
        const invalidUserId = !userId
        const invalidUserSub = Object.keys(decryptedSessionCookie).length !== 3;
        if (invalidUserId || invalidUserSub ) {
            return NextResponse.json({"error": unauthenticatedErrorMessage}, {status: 401});
        }
        let userRole = null;

        try {
            const userData = await getUser(userId);
            userRole = userData.role;
        } catch(error) {
            console.info(`No roles found for user '${userId}'`);
        }
        const isUserDenied = userRole !== "showAdmin";
        if(isUserDenied){
            return NextResponse.json({"error": "you are not authorized to perform that action"}, {status: 403})
        }
    } else {
        return NextResponse.json({"error": unauthenticatedErrorMessage}, {status: 401})
    }

    // validate/sanitize input
    try {
        LeagueConfigUpdate.parse(body);
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

    // update in db
    const leagueConfig: ILeagueConfigurationData = {
        wikiPageUrl: body.wikiPageUrl,
        wikiApiUrl: body.wikiApiUrl,
        googleSheetUrl: body.googleSheetUrl,
        leagueStatus: body.leagueStatus,
        castPhrase: body.castPhrase,
        preGoogleSheetsLinkText: body.preGoogleSheetsLinkText,
        postGoogleSheetsLinkText: body.postGoogleSheetsLinkText,
        competitingEntityName: body.competitingEntityName,
        contestantLeagueDataKeyPrefix: body.contestantLeagueDataKeyPrefix,
        createdBy: userId
    };

    await writeLeagueConfigurationData(leagueConfigurationKey, leagueConfig);

    // return
    return NextResponse.json({"message": "updated"});
}
