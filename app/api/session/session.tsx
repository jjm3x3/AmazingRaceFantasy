import { NextResponse } from "next/server";
export async function createSession({response, exp, session_id}:{response: NextResponse, exp: number, session_id: string}) {
    response.cookies.set("session_id", session_id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: exp
    });
}