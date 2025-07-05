/**
 * @jest-environment node
 */

jest.mock("google-auth-library");
import { OAuth2Client } from "google-auth-library";
import { POST } from "@/app/api/league/route.ts";

const testAuthData = {
    sub: "123googleTestId",
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

describe("POST (unit tests)", () => {

    it("should return a 403 when auth token does not have exact right userId claim", async () => {
        // Aarrange

        const request = {
            json: async () => { return {
                token: "testToken"
            } }
        };

        // Act
        const response = await POST(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(403);
    });
});
