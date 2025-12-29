/**
 * @jest-environment node
 */

jest.mock("google-auth-library");
import { OAuth2Client } from "google-auth-library";
import { POST } from "@/app/api/create-account/route.ts";

const testRequestPayload = {
    token: "testToken"
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

jest.mock("crypto", ()=> {
    return {
        ...jest.requireActual("crypto"),
        randomUUID: jest.fn().mockImplementation(()=> {
            return "google-user-uuid-mock"
        })
    }
});

const redisJsonSetMock = jest.fn();

jest.mock("@upstash/redis", () => {
    return {
        Redis: jest.fn().mockImplementation(() => {
            return {
                json: {
                    set: redisJsonSetMock
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
        const expectedRedisResponse = [ "user:google-user-uuid-mock", "$",  "{\"googleUserId\":\"123googleTestId\",\"userId\":\"google-user-uuid-mock\"}" ];
        expect(redisJsonSetMock).toHaveBeenCalled();
        expect(redisJsonSetMock).toHaveBeenCalledWith(...expectedRedisResponse);
    });
});
