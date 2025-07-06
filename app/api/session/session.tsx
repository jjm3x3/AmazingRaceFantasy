import { NextResponse } from "next/server";
export async function createSession(response: NextResponse, session_id: string) {
    response.cookies.set("session_id", session_id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 // Example: 24 hours
    });
}