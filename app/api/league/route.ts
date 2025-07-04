import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client, TokenPayload } from "google-auth-library";

export async function POST(request: NextRequest) {
    // check auth

    // validate/sanitize input

    // insert into db

    // return
    return NextResponse.json({"message": "posted"});
}
