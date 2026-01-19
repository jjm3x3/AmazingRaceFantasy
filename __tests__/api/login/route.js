/**
 * @jest-environment node
 */

jest.mock("google-auth-library");
import { OAuth2Client } from "google-auth-library";
import { POST } from "@/app/api/login/route.ts";
import Session from "@/app/api/session/session";

const testRequestPayload = {
    token: "testToken"
}

const testAuthData = {
    sub: "123googleTestId",
    email: "test@test.com",
    given_name: "TestFirstName",
    family_name: "TestLastName"
}

const existingUserId = "existing-app-user-id";

const successfulResponse = {
    email: testAuthData.email,
    name: {
        firstName: testAuthData.given_name,
        lastName: testAuthData.family_name
    },
    googleUserId: testAuthData.sub,
    userId: existingUserId
}

const getPayloadMock = jest.fn().mockImplementation(()=> {
    return testAuthData
});

let verifyIdTokenMock = jest.fn().mockImplementation(()=> {
    return {
        getPayload: getPayloadMock
    }
});

OAuth2Client.mockImplementation(() => {
    return {
        verifyIdToken: verifyIdTokenMock
    }
});

jest.mock("../../../app/api/session/session", ()=> {
    return {
        ...jest.requireActual("../../../app/api/session/session"), 
        createSession: jest.fn().mockImplementation(()=>{
            return "someTokenHeader.someTokenBody.someTokenSig"
        })
    }
});

const redisJsonSetMock = jest.fn();
const redisJsonGetMock = jest.fn().mockImplementation((userKey) => {
    if(userKey === "user:userDoesntExist123") {
        return null; // simulate user does not exist
    }
    return {
        googleUserId: "123googleTestIdExists",
        userId: existingUserId
    };
});

jest.mock("@upstash/redis", () => {
    return {
        Redis: jest.fn().mockImplementation(() => {
            return {
                json: {
                    set: redisJsonSetMock,
                    get: redisJsonGetMock
                }
            };
        }),
    };
});

const clientId = "testGoogleLoginClientId";

beforeAll(()=> {
    process.env.GOOGLE_LOGIN_CLIENT_ID = clientId
})

describe("POST", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return the mocked access token", async () => {
        const requestMock = {
            json: async () => (testRequestPayload),
        };
        const LoginResponse = await POST(requestMock);
        const body = await LoginResponse.json();
        expect(verifyIdTokenMock).toHaveBeenCalledWith({
            idToken: testRequestPayload.token,
            audience: clientId
        });
        expect(getPayloadMock).toHaveBeenCalled();
        expect(body).toEqual(successfulResponse);
    });

    it("should catch an exception when one is thrown during verification", async () => {

        // Arrange
        verifyIdTokenMock = jest.fn().mockImplementation(()=> {
            throw new Error("test error");
        });

        const requestMock = {
            json: async () => (testRequestPayload),
        };

        // Act
        let LoginResponse = null;
        try {
            LoginResponse = await POST(requestMock);
        } catch (testError) {
        // Assert
            expect(testError).toBeFalsy(); // should not throw
        }

        expect(LoginResponse).not.toBeNull();
    });

    it("should return a 404 when user does not exist", async () => {

        verifyIdTokenMock = jest.fn().mockImplementation(()=> {
            return {
                getPayload: jest.fn().mockImplementation(()=> {
                    return {
                        sub: "userDoesntExist123",
                        email: "test@test.com",
                        given_name: "TestFirstName",
                        family_name: "TestLastName"
                    }
                })
            };
        });

        const requestMock = {
            json: async () => (testRequestPayload),
        };

        // Act
        const LoginResponse = await POST(requestMock);
        const LoginJson = await LoginResponse.json();

        // Assert
        expect(LoginResponse).not.toBeNull();
        expect(LoginResponse.status).toBe(404);
        expect(LoginJson.error).toBe("User does not exists with the provided google user id");
    });

    it("should catch an exception when one is thrown during verification and return a 401", async () => {

        // Arrange
        verifyIdTokenMock = jest.fn().mockImplementation(()=> {
            throw new Error("test error");
        });

        const requestMock = {
            json: async () => (testRequestPayload),
        };

        // Act
        const LoginResponse = await POST(requestMock);

        // Assert
        expect(LoginResponse).not.toBeNull();
        expect(LoginResponse.status).toBe(401);
    });

    it("should not call Redis to write to database", async ()=> {
        const request = {
            json: async () => (testRequestPayload),
        };
        const LoginResponse = await POST(request);
        await LoginResponse.json();
        expect(redisJsonSetMock).not.toHaveBeenCalled();
    });

    it("should create a session token on successful login", async ()=> {
        verifyIdTokenMock = jest.fn().mockImplementation(()=> {
            return {
                getPayload: getPayloadMock
            }
        });
        const createSessionSpy = jest.spyOn(Session, "createSession");
        const request = {
            json: async () => (testRequestPayload),
        };
        const LoginResponse = await POST(request);
        await LoginResponse.json();
        const expectedSessionData = {
            sub: testAuthData.sub
        };
        expect(createSessionSpy).toHaveBeenCalledTimes(1);
        expect(createSessionSpy).toHaveBeenCalledWith(expect.objectContaining(expectedSessionData));
    });

    it("should return the response on a successful login and session creation", async ()=> {
        verifyIdTokenMock = jest.fn().mockImplementation(()=> {
            return {
                getPayload: getPayloadMock
            }
        });
        const request = {
            json: async () => (testRequestPayload),
        };
        const LoginResponse = await POST(request);
        const responseJson = await LoginResponse.json();
        expect(responseJson).toEqual(successfulResponse);
    });
});
