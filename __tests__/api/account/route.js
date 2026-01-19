/**
 * @jest-environment node
 */

jest.mock("google-auth-library");
import { OAuth2Client } from "google-auth-library";
import { POST } from "@/app/api/account/route.ts";
import { missingBodyErrorMessage, malformedBodyErrorMessage } from "@/app/api/constants/errors";

const testRequestPayload = {
    token: "testToken"
}

const testRequestWithSpecialCharsPayload = {
    token: "test-Token_1.2=3"
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
    beforeEach(() => {
        verifyIdTokenMock = jest.fn().mockImplementation(()=> {
            return {
                getPayload: getPayloadMock
            }
        });
    });

    afterEach(()=> {
        jest.clearAllMocks();
    });
    
    it("should return the mocked access token", async () => {
        const requestMock = {
            json: async () => (testRequestPayload),
        };
        const createAccountResponse = await POST(requestMock);
        const body = await createAccountResponse.json();
        expect(verifyIdTokenMock).toHaveBeenCalledWith({
            idToken: testRequestPayload.token,
            audience: clientId
        });
        expect(getPayloadMock).toHaveBeenCalled();
        expect(body).toEqual(expect.objectContaining({
            email: testAuthData.email,
            name: {
                firstName: testAuthData.given_name,
                lastName: testAuthData.family_name
            },
            googleUserId: testAuthData.sub
        }));
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
        let createAccountResponse = null;
        try {
            createAccountResponse = await POST(requestMock);
        } catch (testError) {
        // Assert
            expect(testError).toBeFalsy(); // should not throw
        }

        expect(createAccountResponse).not.toBeNull();
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
        const createAccountResponse = await POST(requestMock);

        // Assert
        expect(createAccountResponse).not.toBeNull();
        expect(createAccountResponse.status).toBe(401);
    });

    it("should return a 400 when no token is provided", async () => {
        const requestMock = {
            json: async () => ({}),
        };

        // Act
        const createAccountResponse = await POST(requestMock);
        const jsonResponse = await createAccountResponse.json();

        // Assert
        expect(createAccountResponse).not.toBeNull();
        expect(createAccountResponse.status).toBe(400);
        expect(jsonResponse).toEqual({ error: missingBodyErrorMessage });
    });

    it("should return a 400 when only white space as a token is provided", async () => {
        const requestMock = {
            json: async () => ({ token: "   " }),
        };

        // Act
        const createAccountResponse = await POST(requestMock);
        const jsonResponse = await createAccountResponse.json();

        // Assert
        expect(createAccountResponse).not.toBeNull();
        expect(createAccountResponse.status).toBe(400);
        expect(jsonResponse).toEqual({ error: malformedBodyErrorMessage });
    });

    it("should return a 400 when a token with invalid characters is provided", async () => {
        const requestMock = {
            json: async () => ({ token: "123456!@#*$%" }),
        };

        // Act
        const createAccountResponse = await POST(requestMock);
        const jsonResponse = await createAccountResponse.json();

        // Assert
        expect(createAccountResponse).not.toBeNull();
        expect(createAccountResponse.status).toBe(400);
        expect(jsonResponse).toEqual({ error: malformedBodyErrorMessage });
    });

    it("should successfully post to Redis", async ()=> {
        const request = {
            json: async () => (testRequestPayload),
        };
        const createAccountResponse = await POST(request);
        await createAccountResponse.json();
        
        const expectedRedisResponse = [ "user:123googleTestId", "$", expect.stringContaining("{\"googleUserId\":\"123googleTestId\"")];
        expect(redisJsonSetMock).toHaveBeenCalled();
        expect(redisJsonSetMock).toHaveBeenCalledWith(...expectedRedisResponse);
    });

    it("should successfully post to Redis with special character token", async ()=> {
        const request = {
            json: async () => (testRequestWithSpecialCharsPayload),
        };
        const createAccountResponse = await POST(request);
        await createAccountResponse.json();
        
        expect(createAccountResponse.status).not.toBe(400);
        const expectedRedisResponse = [ "user:123googleTestId", "$", expect.stringContaining("{\"googleUserId\":\"123googleTestId\"")];
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

        const request = {
            json: async () => (testRequestAccountExistsPayload),
        };

        // Act
        const createAccountResponse = await POST(request);
        const jsonResponse = await createAccountResponse.json();

        // Assert
        expect(jsonResponse).toEqual({ error: "User already exists with the provided google user id" });
    });
});
