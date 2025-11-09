import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    console.log("cron endpoint hit");

    const authHeader = request.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        console.log("cron caller unathorized");
        return new Response("Unauthorized", {
            status: 401,
        });
    }

    console.log("cron function triggered");

    return NextResponse.json({ success: true });
}
