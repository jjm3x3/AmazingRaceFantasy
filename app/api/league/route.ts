import { NextRequest, NextResponse } from "next/server";
import validationPattern from "@/app/dataSources/validationPatterns";
import * as z from "zod/v4";
import { decrypt } from "@/app/api/session/session";
import { getUser, getAllKeys, getLeagueConfigurationData, writeLeagueConfigurationData } from "@/app/dataSources/dbFetch";
import { unauthenticatedErrorMessage } from "@/app/api/constants/errors";

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
        contestantLeagueDataKeyPrefix: `${body.leagueKey}:*`,
        createdBy: userId
    };

    await writeLeagueConfigurationData(leagueConfigKey, leagueConfig);

    // return
    return NextResponse.json({"message": "posted"});
}

export async function PUT (request: NextRequest) {
    // check auth
    const body = await request.json();
    const sessionCookie = request.cookies.get("session");
    if(!sessionCookie){
        return NextResponse.json({"error": unauthenticatedErrorMessage}, {status: 401});
    }
    
    const decryptedSessionCookie = await decrypt(sessionCookie?.value) as decryptionPayload;
    const userId = decryptedSessionCookie?.sub;
    const invalidUserId = !userId;
    const invalidUserSub = Object.keys(decryptedSessionCookie).length !== 3;
    if (invalidUserId || invalidUserSub ) {
        return NextResponse.json({"error": unauthenticatedErrorMessage}, {status: 401});
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

    // check permissions - only allow if user is league owner
    const leagueConfigurationKeyArray = await getAllKeys(`league_configuration:*:${body.leagueKey}`);
    if(leagueConfigurationKeyArray.length === 0){
        return NextResponse.json({"error": "no league configuration found for that league key"}, {status: 404});
    } else if (leagueConfigurationKeyArray.length > 1){
        return NextResponse.json({"error": "multiple league configurations found for that league key, please contact support"}, {status: 500});
    } else {
        const leagueConfigurationKey = leagueConfigurationKeyArray[0];
        const leagueConfigurationData = await getLeagueConfigurationData(leagueConfigurationKey);
        const isUserDenied = userId !== leagueConfigurationData.createdBy;
        if(isUserDenied){
            return NextResponse.json({"error": "you are not authorized to perform that action"}, {status: 403});
        }
    }

    // insert into db
    const leagueConfigKey = `league_configuration:${body.leagueStatus}:${body.leagueKey}`;
    const leagueConfig = {
        wikiPageUrl: body.wikiPageUrl,
        wikiApiUrl: body.wikiApiUrl,
        googleSheetUrl: body.googleSheetUrl,
        leagueStatus: body.leagueStatus,
        castPhrase: body.wikiSectionHeader,
        preGoogleSheetsLinkText: "This season's contestant data has been sourced from",
        postGoogleSheetsLinkText: "which was populated using a google form.",
        competitingEntityName: body.contestantType,
        contestantLeagueDataKeyPrefix: `${body.leagueKey}:*`,
        createdBy: userId
    };

    await writeLeagueConfigurationData(leagueConfigKey, leagueConfig);

    // return
    return NextResponse.json({"message": "posted"});
}
