import "server-only";
import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const sessionSecretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(sessionSecretKey);

export async function encrypt({ 
    envelope, 
    sub, 
    iat,
    exp 
}:{ 
    envelope: JWTPayload, 
    sub: string, 
    iat: number,
    exp: number 
}) {
    if(sessionSecretKey !== undefined){
        return new SignJWT(envelope)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setSubject(sub)
            .setExpirationTime(exp)
            .setIssuedAt(iat)
            .sign(encodedKey)
    } else {
        throw Error("sessionSecretKey is unset. Have you gone through the setup in the README?")
    }
}

export const decrypt = async function(session: string | undefined = "") {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ["HS256"],
        })
        return payload
    } catch (error) {
        console.warn(`Encountered error while verifying session token: ${error}`);
        return NextResponse.json(
            {"error": "Failed to verify session"},
            {status: 401}
        );
    }
}

export async function createSession({ 
    response, 
    envelope, 
    exp,
    iat,
    sub
}:{ 
    response: NextResponse, 
    envelope: JWTPayload, 
    exp: number,
    iat: number,
    sub: string
}) {
    const session = await encrypt({ envelope, sub, iat, exp });
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
    response.cookies.set(sessionCookieName, sessionCookie.value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0
    });
}
