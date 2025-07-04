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
                wikiPageName: "someName",
                googleSheetUrl: "https://some.url",
                leagueStatus: "active"
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
                token: "testToken",
                googleSheetUrl: "http://some.url",
                leagueStatus: "active"
            } }
        };

        // Act
        const response = await POST(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(400);

        const rawBody = await response.body.getReader().read()
        const bodyString = new TextDecoder().decode(rawBody.value)
        expect(bodyString).toContain("wikiPageName");
    });

    it("should return a 400 when missing googleSheetUrl", async () => {
        // Aarrange
        const request = {
            json: async () => { return {
                token: "testToken",
                wikiPageName: "someName",
                leagueStatus: "active"
            } }
        };

        // Act
        const response = await POST(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(400);

        const rawBody = await response.body.getReader().read()
        const bodyString = new TextDecoder().decode(rawBody.value)
        expect(bodyString).toContain("googleSheetUrl");
    });

    it("should return a 400 when googleSheetUrl is invalid probably has spaces", async () => {
        // Aarrange
        const request = {
            json: async () => { return {
                token: "testToken",
                wikiPageName: "someName",
                googleSheetUrl: "not a url",
                leagueStatus: "active"
            } }
        };

        // Act
        const response = await POST(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(400);

        const rawBody = await response.body.getReader().read()
        const bodyString = new TextDecoder().decode(rawBody.value)
        expect(bodyString).toContain("googleSheetUrl");
    });

    it("should return a 400 when googleSheetUrl is invalid probably doens't have a scheme", async () => {
        // Aarrange
        const request = {
            json: async () => { return {
                token: "testToken",
                wikiPageName: "someName",
                googleSheetUrl: "sup",
                leagueStatus: "active"
            } }
        };

        // Act
        const response = await POST(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(400);

        const rawBody = await response.body.getReader().read()
        const bodyString = new TextDecoder().decode(rawBody.value)
        expect(bodyString).toContain("googleSheetUrl");
    });

    it("should return a 400 when googleSheetUrl has a insecure http scheme", async () => {
        // Aarrange
        const request = {
            json: async () => { return {
                token: "testToken",
                wikiPageName: "someName",
                googleSheetUrl: "http:sup",
                leagueStatus: "active"
            } }
        };

        // Act
        const response = await POST(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(400);

        const rawBody = await response.body.getReader().read()
        const bodyString = new TextDecoder().decode(rawBody.value)
        expect(bodyString).toContain("googleSheetUrl");
    });

    it("should return a 400 when googleSheetUrl has a invalid domain", async () => {
        // Aarrange
        const request = {
            json: async () => { return {
                token: "testToken",
                wikiPageName: "someName",
                googleSheetUrl: "https:sup_blah_{_ga*b;ge_d^ta", // the '^' is what breaks the domain regex
                leagueStatus: "active"
            } }
        };

        // Act
        const response = await POST(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(400);

        const rawBody = await response.body.getReader().read()
        const bodyString = new TextDecoder().decode(rawBody.value)
        expect(bodyString).toContain("googleSheetUrl");
    });

    it("should return a 400 when missing leagueStatus", async () => {
        // Aarrange
        const request = {
            json: async () => { return {
                token: "testToken",
                wikiPageName: "someName",
                googleSheetUrl: "http://some.url",
            } }
        };

        // Act
        const response = await POST(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(400);

        const rawBody = await response.body.getReader().read()
        const bodyString = new TextDecoder().decode(rawBody.value)
        expect(bodyString).toContain("leagueStatus");
    });

    it("should return a 400 with an invalid leagueStatus", async () => {
        // Aarrange
        const request = {
            json: async () => { return {
                token: "testToken",
                wikiPageName: "someName",
                googleSheetUrl: "http://some.url",
                leagueStatus: "maybe-active"
            } }
        };

        // Act
        const response = await POST(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(400);

        const rawBody = await response.body.getReader().read()
        const bodyString = new TextDecoder().decode(rawBody.value)
        expect(bodyString).toContain("leagueStatus");
    });
});
