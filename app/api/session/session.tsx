import { cookies } from "next/headers"

export async function createSession(session_id:string) {
    cookies().set("session_id", session_id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 // Example: 24 hours
    });
}