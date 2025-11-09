import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    console.log("cron function triggered");

    return NextResponse.json({ success: true });
}
