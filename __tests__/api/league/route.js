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
            json: jest.fn().mockImplementation(async () => { return {
                token: "testToken",
                wikiPageName: "someName",
                googleSheetUrl: "https://some.url",
                leagueStatus: "active",
                wikiSectionHeader: "Show Contestants",
                contestantType: "team",
                leagueKey: "some_show_name:and_season_1"
            } })
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
                googleSheetUrl: "https://some.url",
                leagueStatus: "active",
                wikiSectionHeader: "Show Contestants",
                contestantType: "team",
                leagueKey: "some_show_name:and_season_1"
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

    it("should return a 400 when wikiPageName has whitespace", async () => {
        // Aarrange
        const request = {
            json: async () => { return {
                token: "testToken",
                wikiPageName: "page name with whitespace",
                googleSheetUrl: "https://some.url",
                leagueStatus: "active",
                wikiSectionHeader: "Show Contestants",
                contestantType: "team",
                leagueKey: "some_show_name:and_season_1"
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

    it("should return a 200 when wikiPageName has name like a known BB season", async () => {
        // Aarrange
        const request = {
            json: async () => { return {
                token: "testToken",
                wikiPageName: "Big_Brother_26_(American_season)",
                googleSheetUrl: "https://some.url",
                leagueStatus: "active",
                wikiSectionHeader: "Show Contestants",
                contestantType: "team",
                leagueKey: "some_show_name:and_season_1"
            } }
        };

        // Act
        const response = await POST(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(200);
    });

    it("should return a 400 when missing googleSheetUrl", async () => {
        // Aarrange
        const request = {
            json: async () => { return {
                token: "testToken",
                wikiPageName: "someName",
                leagueStatus: "active",
                wikiSectionHeader: "Show Contestants",
                contestantType: "team",
                leagueKey: "some_show_name:and_season_1"
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
                leagueStatus: "active",
                wikiSectionHeader: "Show Contestants",
                contestantType: "team",
                leagueKey: "some_show_name:and_season_1"
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
                leagueStatus: "active",
                wikiSectionHeader: "Show Contestants",
                contestantType: "team",
                leagueKey: "some_show_name:and_season_1"
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
                leagueStatus: "active",
                wikiSectionHeader: "Show Contestants",
                contestantType: "team",
                leagueKey: "some_show_name:and_season_1"
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
                leagueStatus: "active",
                wikiSectionHeader: "Show Contestants",
                contestantType: "team",
                leagueKey: "some_show_name:and_season_1"
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
                googleSheetUrl: "https://some.url",
                wikiSectionHeader: "Show Contestants",
                contestantType: "team",
                leagueKey: "some_show_name:and_season_1"
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
                googleSheetUrl: "https://some.url",
                leagueStatus: "maybe-active",
                wikiSectionHeader: "Show Contestants",
                contestantType: "team",
                leagueKey: "some_show_name:and_season_1"
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

    it("should return a 400 when missing wikiSectionHeader", async () => {
        // Aarrange
        const request = {
            json: async () => { return {
                token: "testToken",
                wikiPageName: "someName",
                googleSheetUrl: "https://some.url",
                leagueStatus: "active",
                contestantType: "team",
                leagueKey: "some_show_name:and_season_1"
            } }
        };

        // Act
        const response = await POST(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(400);

        const rawBody = await response.body.getReader().read()
        const bodyString = new TextDecoder().decode(rawBody.value)
        expect(bodyString).toContain("wikiSectionHeader");
    });

    it("should return a 400 when missing contestantType", async () => {
        // Aarrange
        const request = {
            json: async () => { return {
                token: "testToken",
                wikiPageName: "someName",
                googleSheetUrl: "https://some.url",
                leagueStatus: "active",
                wikiSectionHeader: "Show Contestants",
                leagueKey: "some_show_name:and_season_1"
            } }
        };

        // Act
        const response = await POST(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(400);

        const rawBody = await response.body.getReader().read()
        const bodyString = new TextDecoder().decode(rawBody.value)
        expect(bodyString).toContain("contestantType");
    });

    it("should return a 400 when missing leagueKey", async () => {
        // Aarrange
        const request = {
            json: async () => { return {
                token: "testToken",
                wikiPageName: "someName",
                googleSheetUrl: "https://some.url",
                leagueStatus: "active",
                wikiSectionHeader: "Show Contestants",
                contestantType: "team"
            } }
        };

        // Act
        const response = await POST(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(400);

        const rawBody = await response.body.getReader().read()
        const bodyString = new TextDecoder().decode(rawBody.value)
        expect(bodyString).toContain("leagueKey");
    });

    it("should return a 400 when leagueKey is invalid because it has spaces", async () => {
        // Aarrange
        const request = {
            json: async () => { return {
                token: "testToken",
                wikiPageName: "someName",
                googleSheetUrl: "https://some.url",
                leagueStatus: "active",
                wikiSectionHeader: "Show Contestants",
                contestantType: "team",
                leagueKey: "some_show _name:and_season_1"
            } }
        };

        // Act
        const response = await POST(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(400);

        const rawBody = await response.body.getReader().read()
        const bodyString = new TextDecoder().decode(rawBody.value)
        expect(bodyString).toContain("leagueKey");
    });

    it("should return a 400 when leagueKey is invalid because it has '*'", async () => {
        // Aarrange
        const request = {
            json: async () => { return {
                token: "testToken",
                wikiPageName: "someName",
                googleSheetUrl: "https://some.url",
                leagueStatus: "active",
                wikiSectionHeader: "Show Contestants",
                contestantType: "team",
                leagueKey: "some_show_name:and_season_1:*"
            } }
        };

        // Act
        const response = await POST(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(400);

        const rawBody = await response.body.getReader().read()
        const bodyString = new TextDecoder().decode(rawBody.value)
        expect(bodyString).toContain("leagueKey");
    });
});
