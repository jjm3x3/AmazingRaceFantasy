import { NextRequest, NextResponse } from "next/server";
import validationPattern from "@/app/dataSources/validationPatterns";
import * as z from "zod/v4";
import { decrypt } from "@/app/api/session/session";
import { getUser, getAllKeys, getLeagueConfigurationData, writeLeagueConfigurationData, updateLeagueConfigurationData, ILeagueConfigurationData } from "@/app/dataSources/dbFetch";
import { unauthenticatedErrorMessage } from "@/app/api/errors/messages";
import { parsingErrorResponse } from "@/app/api/errors/responses";

interface decryptionPayload {
    sub: string,
    iat: number,
    exp: number
}

// a JWT is three base64url segments (header.payload.signature) separated by "."
const isWellFormedJwt = (token: string | undefined) => typeof token === "string" && token.split(".").length === 3;

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
    if(!sessionCookie || !isWellFormedJwt(sessionCookie.value)){
        return NextResponse.json({"error": unauthenticatedErrorMessage}, {status: 401})
    }
    const decryptedSessionCookie = await decrypt(sessionCookie.value) as decryptionPayload;
    const userId: string | undefined = decryptedSessionCookie?.sub;
    if (!userId) {
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

    // validate/sanitize input
    const bodyResult = LeagueConfig.safeParse(body);
    if (!bodyResult.success) {
        const firstIssue = bodyResult.error.issues[0];
        return parsingErrorResponse(String(firstIssue.path[0]), firstIssue.message);
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

// The league id is opaque to clients. For now it is the league key (showName:showSeason),
// so this route is the only place that turns it into a league configuration key.
const LeagueId = validationPattern.leagueKey.zod;

const LeagueConfigUpdate = z.object({
    wikiPageName: validationPattern.wikiPageUrl.zod,
    wikiSectionHeader: validationPattern.wikiSectionHeader.zod,
    contestantType: validationPattern.contestantType.zod,
    leagueStatus: validationPattern.leagueStatus.zod,
    googleSheetUrl: validationPattern.googleSheetUrl.zod
});

// leagueId is optional only so this handler also type checks as the /api/league route while it
// lives here for review; without one the request fails validation below with a 400
export async function PUT(request: NextRequest, { params }: { params: Promise<{ leagueId?: string }> }) {
    // check auth
    const { leagueId } = await params;
    const body = await request.json();
    const sessionCookie = request.cookies.get("session");
    if(!sessionCookie || !isWellFormedJwt(sessionCookie.value)){
        return NextResponse.json({"error": unauthenticatedErrorMessage}, {status: 401});
    }

    const decryptedSessionCookie = await decrypt(sessionCookie.value) as decryptionPayload;
    const userId = decryptedSessionCookie?.sub;
    if (!userId) {
        return NextResponse.json({"error": unauthenticatedErrorMessage}, {status: 401});
    }

    // validate/sanitize input
    const leagueIdResult = LeagueId.safeParse(leagueId);
    if (!leagueIdResult.success) {
        return parsingErrorResponse("leagueId", leagueIdResult.error.issues[0].message);
    }
    const bodyResult = LeagueConfigUpdate.safeParse(body);
    if (!bodyResult.success) {
        const firstIssue = bodyResult.error.issues[0];
        return parsingErrorResponse(String(firstIssue.path[0]), firstIssue.message);
    }
    const updateRequest = bodyResult.data;

    // check permissions - only allow if user is league owner
    const leagueConfigurationKeyArray = await getAllKeys(`league_configuration:*:${leagueId}`);
    if(leagueConfigurationKeyArray.length === 0){
        return NextResponse.json({"error": "no league configuration found for that league id"}, {status: 404});
    } else if (leagueConfigurationKeyArray.length > 1){
        return NextResponse.json({"error": "multiple league configurations found for that league id, please contact support"}, {status: 409});
    }

    const preexistingLeagueConfigurationKey = leagueConfigurationKeyArray[0];
    const leagueConfigurationData = await getLeagueConfigurationData(preexistingLeagueConfigurationKey);
    const isUserDenied = userId !== leagueConfigurationData.createdBy;
    if(isUserDenied){
        return NextResponse.json({"error": "you are not authorized to perform that action"}, {status: 403});
    }

    // update in db, keeping every stored field that is not editable through this endpoint
    const leagueConfig: ILeagueConfigurationData = {
        ...leagueConfigurationData,
        wikiPageUrl: `https://en.wikipedia.org/wiki/${updateRequest.wikiPageName}`,
        wikiApiUrl: `https://en.wikipedia.org/w/api.php?action=parse&format=json&page=${updateRequest.wikiPageName}`,
        castPhrase: updateRequest.wikiSectionHeader,
        competitingEntityName: updateRequest.contestantType,
        leagueStatus: updateRequest.leagueStatus,
        googleSheetUrl: updateRequest.googleSheetUrl
    };
    await updateLeagueConfigurationData(preexistingLeagueConfigurationKey, leagueConfig);

    // return
    return NextResponse.json({"message": "updated"});
}
