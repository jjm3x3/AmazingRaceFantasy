/**
 * @jest-environment node
 */

jest.mock("google-auth-library");
import { OAuth2Client } from "google-auth-library";
import { POST } from "@/app/api/login/route.ts";

const testRequestPayload = {
    token: "testToken"
}

const testAuthData = {
    email: "test@test.com",
    given_name: "TestFirstName",
    family_name: "TestLastName"
}

const getPayloadMock = jest.fn().mockImplementation(()=> {
    return testAuthData
});

const verifyIdTokenMock = jest.fn().mockImplementation(()=> {
    return {
        getPayload: getPayloadMock
    }
});

OAuth2Client.mockImplementation(() => {
    return {
        verifyIdToken: verifyIdTokenMock
    }
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
        const LoginResponse = await POST(requestMock);
        const body = await LoginResponse.json();
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
            }
        });
    });
});