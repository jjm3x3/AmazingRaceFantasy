import "server-only";
import { JWTPayload, SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";

const sessionSecretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(sessionSecretKey);

export async function encrypt({ 
    envelope, 
    sub, 
    exp 
}:{ 
    envelope: JWTPayload, 
    sub: string, 
    exp: number 
}) {
    if(sessionSecretKey !== undefined){
        return new SignJWT(envelope)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setSubject(sub)
            .setExpirationTime(exp)
            .sign(encodedKey)
    } else {
        throw Error("sessionSecretKey is unset. Have you gone through the setup in the README?")
    }
}

export async function createSession({ 
    response, 
    envelope, 
    exp,
    sub
}:{ 
    response: NextResponse, 
    envelope: JWTPayload, 
    exp: number,
    sub: string
}) {
    const session = await encrypt({ envelope, sub, exp });
    response.cookies.set("session", session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: exp
    });
}

export async function removeSession(request: NextRequest, response: NextResponse) {
    const sessionCookieName = "session";
    const sessionCookie = request.cookies.get(sessionCookieName);
    if (sessionCookie === undefined) {
        console.warn("Client tried to logout without an existing sessionCookie in the logout request");
        return;
    }
    response.cookies.set(sessionCookieName, sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0
    });
}
