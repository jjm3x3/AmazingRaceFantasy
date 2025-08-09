import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const newUrl = new URL("/", request.url)
    const response = NextResponse.redirect(newUrl, 302);

    return response;
}
