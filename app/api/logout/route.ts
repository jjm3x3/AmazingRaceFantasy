import { NextRequest, NextResponse } from "next/server";
import { removeSession } from "../session/session";

export async function POST(request: NextRequest) {
    const response = new NextResponse(null, {status: 205});
    removeSession(request, response);

    return response;
}
