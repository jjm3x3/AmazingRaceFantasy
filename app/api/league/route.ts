import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    // check auth

    // validate/sanitize input

    // insert into db

    // return
    return NextResponse.json({"message": "posted"});
}
