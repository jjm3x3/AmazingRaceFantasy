import { OAuth2Client } from "google-auth-library";
import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export async function POST(request: NextRequest) {
    const client = new OAuth2Client();
    const body = await request.json();
    const clientId = process.env.GOOGLE_LOGIN_CLIENT_ID;
    const authResponse = await client.verifyIdToken({
        idToken: body.token,
        audience: clientId
    });
    const payload = authResponse.getPayload();
    const googleUserId = payload["sub"];

    // Setup Redis
    const redisOptions = {
        url: process.env.KV_REST_API_URL,
        token: process.env.KV_REST_API_TOKEN
    };
    const redis = new Redis(redisOptions);

    // Post to DB
    const userDbObj = { googleUserId }
    const leagueConfigString = JSON.stringify(userDbObj)
    await redis.json.set(`user:${googleUserId}`, "$", leagueConfigString)

    // Data to send to the front end
    const userObj = {
        email: payload?.email,
        name: {
            firstName: payload?.given_name,
            lastName: payload?.family_name
        }
    }
    return NextResponse.json(userObj);
}