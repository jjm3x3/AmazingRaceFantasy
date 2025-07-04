import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client, TokenPayload } from "google-auth-library";

export async function POST(request: NextRequest) {
    // check auth
    const body = await request.json();
    if (!body.token) {
        return NextResponse.json({"error": "you are not authenticated with this service"}, {status: 401})
    }

    // validate/sanitize input

    // insert into db

    // return
    return NextResponse.json({"message": "posted"});
}
