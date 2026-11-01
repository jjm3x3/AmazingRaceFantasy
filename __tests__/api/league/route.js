/**
 * @jest-environment node
 */

jest.mock("google-auth-library");
jest.mock("../../../app/dataSources/dbFetch");
import * as sessionModule from "../../../app/api/session/session";
import { OAuth2Client } from "google-auth-library";
import { writeLeagueConfigurationData, getUser, getAllKeys, getLeagueConfigurationData, updateLeagueConfigurationData } from "@/app/dataSources/dbFetch";
import { POST, PUT } from "@/app/api/league/route.ts";

let testAuthData = {}
let happyPathRequest = {}
const leagueConfigKey = "some_show_name:and_season_1";
const context = { params: Promise.resolve({ leagueId: leagueConfigKey }) };

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

updateLeagueConfigurationData.mockImplementation(() => {
    return Promise.resolve();
});

const ourUserId = "ourUserId67C20C65-064D-444C-9AC0-DB5E14A38863";
const validSessionCookie = { name: "session", value: "header.payload.signature" };

jest.mock("../../../app/api/session/session", ()=> {
    const actual = jest.requireActual("../../../app/api/session/session");
    return {
        ...actual,
        decrypt: jest.fn().mockImplementation(()=> {
            return {
                sub: ourUserId,
                ias: "",
                exp: ""
            }
        })
    }
})

beforeEach(() => {
    testAuthData = {
        sub: "googleUserId108251633753098119380xxx",
        email: "test@test.com",
        given_name: "TestFirstName",
        family_name: "TestLastName"
    };

    getUser.mockImplementation(() => {
        return Promise.resolve({
            role: "showAdmin"
        });
    });

});

afterEach(() => {
    jest.clearAllMocks();
});

describe("POST (unit tests)", () => {
    beforeEach(()=> {
        happyPathRequest = {
            token: "testToken",
            wikiPageName: "someName",
            googleSheetUrl: "https://some.url",
            leagueStatus: "active",
            wikiSectionHeader: "Show Contestants",
            contestantType: "team",
            leagueKey: leagueConfigKey
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return 200 when conditions met", async () => {
        // Arrange
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
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

    it("should return a 403 when auth token does not have exact right userId claim", async () => {
        // Arrange
        getUser.mockImplementation(() => {
            return Promise.resolve({
                role: "anybody"
            });
        });
        jest.spyOn(sessionModule, "decrypt").mockImplementationOnce(()=> {
            return {
                sub: "123googleTestId",
                ias: "",
                exp: ""
            }
        });
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
            json: async () => { return { } }
        };

        // Act
        const response = await POST(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(403);
    });

    it("should return a 403 when getUser throws an exception", async () => {
        // Arrange
        getUser.mockImplementation(() => {
            return Promise.reject(new Error("Database error"));
        });
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest
            })
        };

        // Act
        const response = await POST(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(403);
    });

    it("should return a 400 when missing wikiPageName", async () => {
        // Aarrange
        happyPathRequest.wikiPageName = null;
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
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
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
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
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
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
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
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
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
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
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
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
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
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
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
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
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
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
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
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
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
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
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
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
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
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
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
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
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
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
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
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
        expect(writeLeagueConfigurationData).toHaveBeenCalledWith(
            `league_configuration:${happyPathRequest.leagueStatus}:${happyPathRequest.leagueKey}`,
            expect.anything());
    })

    it("should call writeLeagueConfigurationData with a config with a wikiPageUrl", async () => {
        // Arrange
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
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
        expect(writeLeagueConfigurationData).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                "wikiPageUrl": `https://en.wikipedia.org/wiki/${happyPathRequest.wikiPageName}`
            }));
    });

    it("should call writeLeagueConfigurationData with a config with a wikiApiUrl", async () => {
        // Arrange
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
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
        expect(writeLeagueConfigurationData).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                "wikiApiUrl": `https://en.wikipedia.org/w/api.php?action=parse&format=json&page=${happyPathRequest.wikiPageName}`,
            }));
    });

    it("should call writeLeagueConfigurationData with a config with a googleSheetUrl", async () => {
        // Arrange
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
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
        expect(writeLeagueConfigurationData).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                "googleSheetUrl": happyPathRequest.googleSheetUrl,
            }));
    });

    it("should call writeLeagueConfigurationData with a config with a leageStatus", async () => {
        // Arrange
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
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
        expect(writeLeagueConfigurationData).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                "leagueStatus": happyPathRequest.leagueStatus,
            }));
    });

    it("should call writeLeagueConfigurationData with a config with a castPhrase", async () => {
        // Arrange
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
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
        expect(writeLeagueConfigurationData).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                "castPhrase": happyPathRequest.wikiSectionHeader,
            }));
    });

    it("should call writeLeagueConfigurationData with a config with a preGoogleSheetsLinkText", async () => {
        // Arrange
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
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
        expect(writeLeagueConfigurationData).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                "preGoogleSheetsLinkText": expect.anything(),
            }));
    });

    it("should call writeLeagueConfigurationData with a config with a postGoogleSheetsLinkText", async () => {
        // Arrange
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
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
        expect(writeLeagueConfigurationData).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                "postGoogleSheetsLinkText": expect.anything(),
            }));
    });

    it("should call writeLeagueConfigurationData with a config with a competingEntityName", async () => {
        // Arrange
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
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
        expect(writeLeagueConfigurationData).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                "competitingEntityName": happyPathRequest.contestantType,
            }));
    });

    it("should call writeLeagueConfigurationData with a config with a contestantLeagueDataKeyPrefix", async () => {
        // Arrange
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
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
        expect(writeLeagueConfigurationData).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                "contestantLeagueDataKeyPrefix": `${happyPathRequest.leagueKey}:*`
            }));
    });

    it("should call writeLeagueConfigurationData with a config with a createdBy field from the session token", async () => {
        // Arrange
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
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
        expect(writeLeagueConfigurationData).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                "createdBy": ourUserId
            }));
    });

    it("should return a 401 when POST session cookie is missing", async () => {
        // Arrange
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> undefined)
            },
            json: jest.fn().mockImplementation(async () => happyPathRequest)
        };

        // Act
        const response = await POST(request);

        // Assert
        expect(response.status).toEqual(401);
        expect(sessionModule.decrypt).not.toHaveBeenCalled();
    });

    it.each([
        ["has no dots", "testToken"],
        ["has only two parts", "header.payload"],
        ["has more than three parts", "header.payload.signature.extra"],
        ["is empty", ""],
        ["is undefined", undefined]
    ])("should return a 401 without decrypting when POST session cookie value %s", async (_description, cookieValue) => {
        // Arrange
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> ({ name: "session", value: cookieValue }))
            },
            json: jest.fn().mockImplementation(async () => happyPathRequest)
        };

        // Act
        const response = await POST(request);

        // Assert
        expect(response.status).toEqual(401);
        expect(sessionModule.decrypt).not.toHaveBeenCalled();
    });

    it("should return a 401 when POST session cookie decrypts without a sub claim", async () => {
        // Arrange
        jest.spyOn(sessionModule, "decrypt").mockImplementationOnce(()=> ({ iat: "", exp: "" }));
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> validSessionCookie)
            },
            json: jest.fn().mockImplementation(async () => happyPathRequest)
        };

        // Act
        const response = await POST(request);

        // Assert
        expect(response.status).toEqual(401);
    });
});

describe("PUT (unit tests)", () => {
    beforeEach(() => {
        happyPathRequest = {
            wikiPageName: "New_Page_(season)",
            wikiSectionHeader: "HouseGuests",
            contestantType: "team",
            leagueStatus: "active",
            googleSheetUrl: "https://some.url"
        };

        getAllKeys.mockImplementation(() => {
            return Promise.resolve([`league_configuration:${happyPathRequest.leagueStatus}:${leagueConfigKey}`]);
        });
    });

    afterEach(()=> {
        jest.clearAllMocks();
    });

    it("should return 200 when PUT conditions met", async () => {
        // Arrange
        const dbWikiPageUrl = "https://en.wikipedia.org/wiki/Original_Page";
        const dbWikiApiUrl = "https://en.wikipedia.org/w/api.php?action=parse&format=json&page=Original_Page";
        const dbCastPhrase = "Original Cast";
        const dbCompetitingEntityName = "person";
        const dbContestantLeagueDataKeyPrefix = `${leagueConfigKey}:*`;
        
        getLeagueConfigurationData.mockImplementation(() => {
            return Promise.resolve({
                createdBy: ourUserId,
                leagueStatus: happyPathRequest.leagueStatus,
                wikiPageUrl: dbWikiPageUrl,
                wikiApiUrl: dbWikiApiUrl,
                castPhrase: dbCastPhrase,
                competitingEntityName: dbCompetitingEntityName,
                contestantLeagueDataKeyPrefix: dbContestantLeagueDataKeyPrefix
            });
        });

        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest;
            })
        };

        // Act
        const response = await PUT(request, context);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(200);
        expect(request.json).toHaveBeenCalledTimes(1);
        expect(updateLeagueConfigurationData).toHaveBeenCalledTimes(1);
        expect(updateLeagueConfigurationData).toHaveBeenCalledWith(
            `league_configuration:${happyPathRequest.leagueStatus}:${leagueConfigKey}`,
            expect.objectContaining({
                createdBy: ourUserId,
                leagueStatus: happyPathRequest.leagueStatus,
                googleSheetUrl: happyPathRequest.googleSheetUrl
            })
        );
    });

    it("should return a 404 when no league configuration found", async () => {
        // Arrange
        getAllKeys.mockImplementation(() => {
            return Promise.resolve([]);
        });
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest;
            })
        };

        // Act
        const response = await PUT(request, context);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(404);
    });

    it("should return a 409 when multiple league configurations found", async () => {
        // Arrange
        getAllKeys.mockImplementation(() => {
            return Promise.resolve([
                `league_configuration:active:${leagueConfigKey}`,
                `league_configuration:inactive:${leagueConfigKey}`
            ]);
        });
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest;
            })
        };

        // Act
        const response = await PUT(request, context);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(409);
    });

    it("should return a 403 when PUT userId does not match createdBy from database", async () => {
        // Arrange
        getLeagueConfigurationData.mockImplementation(() => {
            return Promise.resolve({
                createdBy: "differentUser"
            });
        });
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest;
            })
        };

        // Act
        const response = await PUT(request, context);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(403);
    });

    it("should return a 400 when PUT has invalid leagueStatus", async () => {
        // Arrange
        const invalidRequestBody = {
            ...happyPathRequest,
            leagueStatus: "maybe-active"
        };
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
            json: jest.fn().mockImplementation(async () => invalidRequestBody)
        };

        // Act
        const response = await PUT(request, context);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(400);

        const rawBody = await response.body.getReader().read();
        const bodyString = new TextDecoder().decode(rawBody.value);
        expect(bodyString).toContain("leagueStatus");
    });

    it("should derive wikiPageUrl, wikiApiUrl, castPhrase, and competitingEntityName from the request when updating", async () => {
        // Arrange
        const dbWikiPageUrl = "https://en.wikipedia.org/wiki/Database_Page";
        const dbWikiApiUrl = "https://en.wikipedia.org/w/api.php?action=parse&format=json&page=Database_Page";
        const dbContestantLeagueDataKeyPrefix = `${leagueConfigKey}:*`;
        const dbCastPhrase = "Original Cast";
        const dbCompetitingEntityName = "person";
        
        getLeagueConfigurationData.mockImplementation(() => {
            return Promise.resolve({
                createdBy: ourUserId,
                leagueStatus: happyPathRequest.leagueStatus,
                wikiPageUrl: dbWikiPageUrl,
                wikiApiUrl: dbWikiApiUrl,
                castPhrase: dbCastPhrase,
                competitingEntityName: dbCompetitingEntityName,
                contestantLeagueDataKeyPrefix: dbContestantLeagueDataKeyPrefix
            });
        });

        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest;
            })
        };

        // Act
        const response = await PUT(request, context);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(200);
        expect(updateLeagueConfigurationData).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                wikiPageUrl: `https://en.wikipedia.org/wiki/${happyPathRequest.wikiPageName}`,
                wikiApiUrl: `https://en.wikipedia.org/w/api.php?action=parse&format=json&page=${happyPathRequest.wikiPageName}`,
                castPhrase: happyPathRequest.wikiSectionHeader,
                competitingEntityName: happyPathRequest.contestantType
            })
        );
    });

    it("should keep the stored parserOptions when updating", async () => {
        // Arrange
        const dbParserOptions = { dayOverrides: [11, 13] };

        getLeagueConfigurationData.mockImplementation(() => {
            return Promise.resolve({
                createdBy: ourUserId,
                leagueStatus: happyPathRequest.leagueStatus,
                wikiPageUrl: "https://en.wikipedia.org/wiki/Database_Page",
                wikiApiUrl: "https://en.wikipedia.org/w/api.php?action=parse&format=json&page=Database_Page",
                castPhrase: "Original Cast",
                competitingEntityName: "person",
                contestantLeagueDataKeyPrefix: `${leagueConfigKey}:*`,
                parserOptions: dbParserOptions
            });
        });

        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest;
            })
        };

        // Act
        const response = await PUT(request, context);

        // Assert
        expect(response.status).toEqual(200);
        expect(updateLeagueConfigurationData).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                parserOptions: dbParserOptions
            })
        );
    });

    it("should call getAllKeys with correct league key pattern", async () => {
        // Arrange
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest;
            })
        };

        // Act
        const response = await PUT(request, context);

        // Assert
        expect(response).not.toBeNull();
        expect(getAllKeys).toHaveBeenCalledWith(`league_configuration:*:${leagueConfigKey}`);
    });

    it("should use the existing league configuration key from the database as the update key", async () => {
        // Arrange
        const dbLeagueConfigurationKey = `league_configuration:archive:${leagueConfigKey}`;
        getAllKeys.mockImplementation(() => {
            return Promise.resolve([dbLeagueConfigurationKey]);
        });
        getLeagueConfigurationData.mockImplementation(() => {
            return Promise.resolve({
                createdBy: ourUserId,
                leagueStatus: "archive",
                wikiPageUrl: "https://en.wikipedia.org/wiki/Page",
                wikiApiUrl: "https://en.wikipedia.org/w/api.php",
                castPhrase: "Cast",
                competitingEntityName: "person",
                contestantLeagueDataKeyPrefix: `${leagueConfigKey}:*`
            });
        });

        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest;
            })
        };

        // Act
        const response = await PUT(request, context);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(200);
        expect(getLeagueConfigurationData).toHaveBeenCalledWith(dbLeagueConfigurationKey);
        expect(updateLeagueConfigurationData).toHaveBeenCalledTimes(1);
        expect(updateLeagueConfigurationData).toHaveBeenCalledWith(
            dbLeagueConfigurationKey,
            expect.objectContaining({
                leagueStatus: happyPathRequest.leagueStatus
            })
        );
    });

    it("should return a 400 when PUT is missing googleSheetUrl", async () => {
        // Arrange
        happyPathRequest.googleSheetUrl = null;
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest;
            })
        };

        // Act
        const response = await PUT(request, context);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(400);
        expect(updateLeagueConfigurationData).not.toHaveBeenCalled();

        const rawBody = await response.body.getReader().read();
        const bodyString = new TextDecoder().decode(rawBody.value);
        expect(bodyString).toContain("googleSheetUrl");
    });

    it("should return a 400 when PUT googleSheetUrl has an invalid value", async () => {
        // Arrange
        happyPathRequest.googleSheetUrl = "not a url";
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest;
            })
        };

        // Act
        const response = await PUT(request, context);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(400);
        expect(updateLeagueConfigurationData).not.toHaveBeenCalled();

        const rawBody = await response.body.getReader().read();
        const bodyString = new TextDecoder().decode(rawBody.value);
        expect(bodyString).toContain("googleSheetUrl");
    });

    it("should return a 400 when PUT googleSheetUrl is invalid probably doesn't have a scheme", async () => {
        // Arrange
        happyPathRequest.googleSheetUrl = "sup";
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest;
            })
        };

        // Act
        const response = await PUT(request, context);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(400);
        expect(updateLeagueConfigurationData).not.toHaveBeenCalled();

        const rawBody = await response.body.getReader().read();
        const bodyString = new TextDecoder().decode(rawBody.value);
        expect(bodyString).toContain("googleSheetUrl");
    });

    it("should return a 400 when PUT googleSheetUrl does not use https", async () => {
        // Arrange
        happyPathRequest.googleSheetUrl = "http://some.url";
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest;
            })
        };

        // Act
        const response = await PUT(request, context);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(400);
        expect(updateLeagueConfigurationData).not.toHaveBeenCalled();

        const rawBody = await response.body.getReader().read();
        const bodyString = new TextDecoder().decode(rawBody.value);
        expect(bodyString).toContain("googleSheetUrl");
    });

    it("should return a 400 when PUT googleSheetUrl has an invalid domain", async () => {
        // Arrange
        happyPathRequest.googleSheetUrl = "https:sup_blah_{_ga*b;ge_d^ta";
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest;
            })
        };

        // Act
        const response = await PUT(request, context);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(400);
        expect(updateLeagueConfigurationData).not.toHaveBeenCalled();

        const rawBody = await response.body.getReader().read();
        const bodyString = new TextDecoder().decode(rawBody.value);
        expect(bodyString).toContain("googleSheetUrl");
    });

    it("should return a 401 when PUT session cookie is missing", async () => {
        // Arrange
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> undefined)
            },
            json: jest.fn().mockImplementation(async () => happyPathRequest)
        };

        // Act
        const response = await PUT(request, context);

        // Assert
        expect(response.status).toEqual(401);
        expect(sessionModule.decrypt).not.toHaveBeenCalled();
    });

    it.each([
        ["has no dots", "testToken"],
        ["has only two parts", "header.payload"],
        ["has more than three parts", "header.payload.signature.extra"],
        ["is empty", ""],
        ["is undefined", undefined]
    ])("should return a 401 without decrypting when PUT session cookie value %s", async (_description, cookieValue) => {
        // Arrange
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> ({ name: "session", value: cookieValue }))
            },
            json: jest.fn().mockImplementation(async () => happyPathRequest)
        };

        // Act
        const response = await PUT(request, context);

        // Assert
        expect(response.status).toEqual(401);
        expect(sessionModule.decrypt).not.toHaveBeenCalled();
    });

    it("should return a 401 when PUT session cookie decrypts without a sub claim", async () => {
        // Arrange
        jest.spyOn(sessionModule, "decrypt").mockImplementationOnce(()=> ({ iat: "", exp: "" }));
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> validSessionCookie)
            },
            json: jest.fn().mockImplementation(async () => happyPathRequest)
        };

        // Act
        const response = await PUT(request, context);

        // Assert
        expect(response.status).toEqual(401);
    });

    it("should keep the stored fields that are not editable when updating", async () => {
        // Arrange
        const dbStoredFields = {
            preGoogleSheetsLinkText: "stored pre text",
            postGoogleSheetsLinkText: "stored post text",
            contestantLeagueDataKeyPrefix: `${leagueConfigKey}:*`
        };

        getLeagueConfigurationData.mockImplementation(() => {
            return Promise.resolve({
                createdBy: ourUserId,
                leagueStatus: happyPathRequest.leagueStatus,
                ...dbStoredFields
            });
        });

        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest;
            })
        };

        // Act
        const response = await PUT(request, context);

        // Assert
        expect(response.status).toEqual(200);
        expect(updateLeagueConfigurationData).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining(dbStoredFields)
        );
    });

    it("should not add parserOptions when none are stored", async () => {
        // Arrange
        getLeagueConfigurationData.mockImplementation(() => {
            return Promise.resolve({
                createdBy: ourUserId,
                leagueStatus: happyPathRequest.leagueStatus
            });
        });

        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest;
            })
        };

        // Act
        const response = await PUT(request, context);

        // Assert
        expect(response.status).toEqual(200);
        const writtenConfig = updateLeagueConfigurationData.mock.calls[0][1];
        expect(writtenConfig).not.toHaveProperty("parserOptions");
    });

    it("should ignore leagueKey and createdBy in the body", async () => {
        // Arrange
        getLeagueConfigurationData.mockImplementation(() => {
            return Promise.resolve({
                createdBy: ourUserId,
                leagueStatus: happyPathRequest.leagueStatus
            });
        });

        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return validSessionCookie
                })
            },
            json: jest.fn().mockImplementation(async () => {
                return {
                    ...happyPathRequest,
                    leagueKey: "other_show:2",
                    createdBy: "someoneElse"
                };
            })
        };

        // Act
        const response = await PUT(request, context);

        // Assert
        expect(response.status).toEqual(200);
        expect(getAllKeys).toHaveBeenCalledWith(`league_configuration:*:${leagueConfigKey}`);
        expect(updateLeagueConfigurationData).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({ createdBy: ourUserId })
        );
    });

    it.each([
        ["has a space", "some show:1"],
        ["has a '*'", "some_show:*"],
        ["is empty", ""]
    ])("should return a 400 when the path leagueId %s", async (_description, invalidLeagueId) => {
        // Arrange
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> validSessionCookie)
            },
            json: jest.fn().mockImplementation(async () => happyPathRequest)
        };

        // Act
        const response = await PUT(request, { params: Promise.resolve({ leagueId: invalidLeagueId }) });

        // Assert
        expect(response.status).toEqual(400);
        expect(getAllKeys).not.toHaveBeenCalled();

        const rawBody = await response.body.getReader().read();
        const bodyString = new TextDecoder().decode(rawBody.value);
        expect(bodyString).toContain("leagueId");
    });

    it.each([
        "wikiPageName",
        "wikiSectionHeader",
        "contestantType",
        "leagueStatus"
    ])("should return a 400 when PUT is missing %s", async (property) => {
        // Arrange
        delete happyPathRequest[property];
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> validSessionCookie)
            },
            json: jest.fn().mockImplementation(async () => happyPathRequest)
        };

        // Act
        const response = await PUT(request, context);

        // Assert
        expect(response.status).toEqual(400);
        expect(updateLeagueConfigurationData).not.toHaveBeenCalled();

        const rawBody = await response.body.getReader().read();
        const bodyString = new TextDecoder().decode(rawBody.value);
        expect(bodyString).toContain(property);
    });

    it("should return a 400 when PUT wikiPageName has whitespace", async () => {
        // Arrange
        happyPathRequest.wikiPageName = "Some Page";
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> validSessionCookie)
            },
            json: jest.fn().mockImplementation(async () => happyPathRequest)
        };

        // Act
        const response = await PUT(request, context);

        // Assert
        expect(response.status).toEqual(400);
        expect(updateLeagueConfigurationData).not.toHaveBeenCalled();

        const rawBody = await response.body.getReader().read();
        const bodyString = new TextDecoder().decode(rawBody.value);
        expect(bodyString).toContain("wikiPageName");
    });
});
