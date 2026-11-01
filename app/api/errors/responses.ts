import { NextResponse } from "next/server";

export const parsingErrorResponse = (property: string, message: string) => NextResponse.json(
    {"error": `parsing error caught, first one being property: '${property}' having issue: '${message}'`},
    {status: 400}
);
