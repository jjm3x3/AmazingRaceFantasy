import { NextRequest, NextResponse } from "next/server";
import { removeSession } from "../session/session";

export async function POST(request: NextRequest) {
    const newUrl = new URL("/", request.url)
    const response = NextResponse.redirect(newUrl, 302);
    removeSession(request, response);

    return response;
}
