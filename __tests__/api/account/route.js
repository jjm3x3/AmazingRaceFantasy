/**
 * @jest-environment node
 */

jest.mock("google-auth-library");
import { OAuth2Client } from "google-auth-library";
import { POST } from "@/app/api/account/route.ts";

const testRequestPayload = {
    token: "testToken"
}

const testRequestAccountExistsPayload = {
    token: "testTokenAccountExists"
}

const testAuthData = {
    sub: "123googleTestId",
    email: "test@test.com",
    given_name: "TestFirstName",
    family_name: "TestLastName"
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

jest.mock("crypto", ()=> {
    return {
        ...jest.requireActual("crypto"),
        randomUUID: jest.fn().mockImplementation(()=> {
            return "google-user-uuid-mock"
        })
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
    if(userKey === "user:123googleTestId") {
        return null; // simulate user does not exist
    }
    return {
        googleUserId: "123googleTestIdExists",
        userId: "existing-app-user-id"
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
});

describe("POST", () => {
    it("should return the mocked access token", async () => {
        const requestMock = {
            json: async () => (testRequestPayload),
        };
        const CreateAccountResponse = await POST(requestMock);
        const body = await CreateAccountResponse.json();
        expect(verifyIdTokenMock).toHaveBeenCalledWith({
            idToken: testRequestPayload.token,
            audience: clientId
        });
        expect(getPayloadMock).toHaveBeenCalled();
        expect(body).toEqual({
            email: testAuthData.email,
            name: {
                firstName: testAuthData.given_name,
                lastName: testAuthData.family_name
            },
            googleUserId: testAuthData.sub
        });
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
        let CreateAccountResponse = null;
        try {
            CreateAccountResponse = await POST(requestMock);
        } catch (testError) {
        // Assert
            expect(testError).toBeFalsy(); // should not throw
        }

        expect(CreateAccountResponse).not.toBeNull();
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
        const CreateAccountResponse = await POST(requestMock);

        // Assert
        expect(CreateAccountResponse).not.toBeNull();
        expect(CreateAccountResponse.status).toBe(401);
    });

    it("should successfully call Redis", async ()=> {
        const request = {
            json: async () => (testRequestPayload),
        };
        const CreateAccountResponse = await POST(request);
        await CreateAccountResponse.json();
        const expectedRedisResponse = [ "user:123googleTestId", "$", "{\"googleUserId\":\"123googleTestId\",\"userId\":\"google-user-uuid-mock\"}" ];
        expect(redisJsonSetMock).toHaveBeenCalled();
        expect(redisJsonSetMock).toHaveBeenCalledWith(...expectedRedisResponse);
    });

    it("shouldn't write to Redis if google account already exists", async ()=> {
        // Arrange
        const testAuthDataAccountExists = {
            sub: "456googleTestIdAccountExists",
            email: "test@testaccountexists.com",
            given_name: "TestFirstNameAccountExists",
            family_name: "TestLastNameAccountExists"
        }
        const getAccountExistsPayloadMock = jest.fn().mockImplementation(()=> {
            return testAuthDataAccountExists
        });
        verifyIdTokenMock = jest.fn().mockImplementation(()=> {
            return {
                getPayload: getAccountExistsPayloadMock
            }
        });

        const { POST } = await import ("../../../app/api/account/route");
        const request = {
            json: async () => (testRequestAccountExistsPayload),
        };

        // Act
        const CreateAccountResponse = await POST(request);
        const jsonResponse = await CreateAccountResponse.json();

        // Assert
        expect(jsonResponse).toEqual({ error: "User already exists with the provided google user id" });
    });
});
