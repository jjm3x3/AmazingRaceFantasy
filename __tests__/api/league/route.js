/**
 * @jest-environment node
 */

jest.mock("google-auth-library");
import { OAuth2Client } from "google-auth-library";
import { POST } from "@/app/api/league/route.ts";

let testAuthData = {}

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

beforeEach(() => {
    testAuthData = {
        sub: "108251633753098119380",
        email: "test@test.com",
        given_name: "TestFirstName",
        family_name: "TestLastName"
    }
});

describe("POST (unit tests)", () => {

    it("should return a 403 when auth token does not have exact right userId claim", async () => {
        // Arrange
        testAuthData.sub = "123googleTestId";
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

    it("should return 200 when conditions met", async () => {
        // Arrange
        const request = {
            json: async () => { return {
                token: "testToken",
                wikiPageName: "someName"
            } }
        };

        // Act
        const response = await POST(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(200);
    });

    it("should return a 400 when missing wikiPageName", async () => {
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
        expect(response.status).toEqual(400);
    });
});
