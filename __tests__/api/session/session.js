/**
 * @jest-environment node
 */
import { removeSession, decrypt } from "@/app/api/session/session.tsx";
import { NextResponse } from "next/server";
import * as jose from "jose";

jest.mock("jose", ()=> {
    return {
        ...jest.requireActual("jose"),
        jwtVerify: jest.fn().mockImplementation(()=> {
            return {
                payload: {
                    sub: "117801378252057178101",
                    iat: 123456,
                    exp: 123456
                }
            }
        })

    }
})
beforeEach(() => {
    global.conosle = {
        log: jest.fn(),
        warn: jest.spyOn(console, "warn").mockImplementation(() => {}),
    };
});

describe ("decrypt", ()=> {
    it("Should return a proper payload when passed a correct session id", async ()=> {
        const decryptedPayload = await decrypt("117801378252057178101");
        expect(decryptedPayload.sub).toBe("117801378252057178101");
    });

    it("Should throw an error when decryption fails", async ()=> {
        jest.spyOn(jose, "jwtVerify").mockImplementation(()=> {
            return NextResponse.json(
                {"error": "Failed to verify session"},
                {status: 401}
            );
        });
        const responseSpy = jest.spyOn(NextResponse, "json");
        const decryptedPayload = await decrypt("117801378252057178101");
        expect(decryptedPayload).toBe(undefined);
        expect(responseSpy).toBeCalledWith( {"error": "Failed to verify session"}, {"status": 401});
    })
})

describe("removeSession", () => {
    it("Should call set on the response on happy path", async () => {

        // Arrange
        const requestMock = {
            cookies: {
                get: () => "a session cookie"
            }
        };

        const responseMock = {
            cookies: {
                set: jest.fn()
            }
        };

        // Act
        await removeSession(requestMock, responseMock);

        // Assert
        expect(responseMock.cookies.set).toBeCalled();
    });

    it("Should log a warning when sessionCookie is not found", async () => {

        // Arrange
        const requestMock = {
            cookies: {
                get: () => undefined
            }
        };

        const responseMock = {
            cookies: {
                set: jest.fn()
            }
        };

        // Act
        await removeSession(requestMock, responseMock);

        // Assert
        expect(console.warn).toHaveBeenCalled();
    });
});
