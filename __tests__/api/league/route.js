/**
 * @jest-environment node
 */

jest.mock("google-auth-library");
jest.mock("../../../app/dataSources/dbFetch");
import { OAuth2Client } from "google-auth-library";
import { writeLeagueConfigurationData } from "@/app/dataSources/dbFetch";
import { POST } from "@/app/api/league/route.ts";

let testAuthData = {}
let happyPathRequest = {}

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

writeLeagueConfigurationData.mockImplementation(() => {
    return () => { }
});

beforeEach(() => {
    testAuthData = {
        sub: "108251633753098119380",
        email: "test@test.com",
        given_name: "TestFirstName",
        family_name: "TestLastName"
    };

    happyPathRequest = {
        token: "testToken",
        wikiPageName: "someName",
        googleSheetUrl: "https://some.url",
        leagueStatus: "active",
        wikiSectionHeader: "Show Contestants",
        contestantType: "team",
        leagueKey: "some_show_name:and_season_1"
    };
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
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest
            })
        };

        // Act
        const response = await POST(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(200);
        expect(request.json).toHaveBeenCalledTimes(1);
    });

    it("should return a 400 when missing wikiPageName", async () => {
        // Aarrange
        happyPathRequest.wikiPageName = null;
        const request = {
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest
            })
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
        happyPathRequest.wikiPageName = "page name with whitespace";
        const request = {
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest
            })
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
        happyPathRequest.wikiPageName = "Big_Brother_26_(American_season)";
        const request = {
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest
            })
        };

        // Act
        const response = await POST(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(200);
    });

    it("should return a 400 when missing googleSheetUrl", async () => {
        // Aarrange
        happyPathRequest.googleSheetUrl = null;
        const request = {
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest
            })
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
        happyPathRequest.googleSheetUrl = "not a url";
        const request = {
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest
            })
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
        happyPathRequest.googleSheetUrl = "sup";
        const request = {
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest
            })
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
        happyPathRequest.googleSheetUrl = "http:sup";
        const request = {
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest
            })
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
        happyPathRequest.googleSheetUrl = "https:sup_blah_{_ga*b;ge_d^ta"; // the '^' is what breaks the domain regex
        const request = {
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest
            })
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
        happyPathRequest.leagueStatus = null;
        const request = {
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest
            })
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
        happyPathRequest.leagueStatus = "maybe-active";
        const request = {
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest
            })
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
        happyPathRequest.wikiSectionHeader = null;
        const request = {
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest
            })
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
        happyPathRequest.contestantType = null;
        const request = {
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest
            })
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
        happyPathRequest.leagueKey = null;
        const request = {
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest
            })
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
        happyPathRequest.leagueKey = "some_show _name:and_season_1";
        const request = {
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest
            })
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
        happyPathRequest.leagueKey = "some_show_name:and_season_1:*";
        const request = {
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest
            })
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

    it("should call writeLeagueConfigurationData with expected key", async () => {
        // Arrange
        const request = {
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest
            })
        };

        // Act
        const response = await POST(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(200);
        expect(request.json).toHaveBeenCalledTimes(1);
        expect(writeLeagueConfigurationData).toHaveBeenCalledTimes(1);
    })
});
