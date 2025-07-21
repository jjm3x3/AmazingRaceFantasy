import "server-only";
import { JWTPayload, SignJWT } from "jose";
import { NextResponse } from "next/server";

const sessionSecretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(sessionSecretKey);

export async function encrypt({ envelope, exp }:{ envelope: JWTPayload, exp: number }) {
    if(encodedKey){
        return new SignJWT(envelope)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime(exp)
            .sign(encodedKey)
    } else {
        throw Error("sessionSecretKey is unset. Have you gone through the setup in the README?")
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