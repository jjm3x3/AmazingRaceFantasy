import "server-only";
import { JWTPayload, SignJWT, jwtVerify } from "jose";
import { NextResponse } from "next/server";

const sessionSecretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(sessionSecretKey);

export async function encrypt({ envelope, exp }:{ envelope: JWTPayload, exp: number }) {
    return new SignJWT(envelope)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(exp)
        .sign(encodedKey)
}
 
export async function decrypt(session: string | undefined = "") {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ["HS256"],
        })
        return payload
    } catch (error) {
        console.log("Failed to verify session")
    }
}

export async function createSession({ response, envelope, exp }:{ response: NextResponse, envelope: JWTPayload, exp: number }) {
    const session = await encrypt({ envelope, exp });
    response.cookies.set("session", session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: exp
    });
}