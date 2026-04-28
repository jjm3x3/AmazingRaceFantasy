/**
 * @jest-environment node
 */

jest.mock("google-auth-library");
jest.mock("../../../app/dataSources/dbFetch");
import * as sessionModule from "../../../app/api/session/session";
import { OAuth2Client } from "google-auth-library";
import { writeLeagueConfigurationData, getUser, getAllKeys, getLeagueConfigurationData, deleteLeagueConfigurationData } from "@/app/dataSources/dbFetch";
import { POST, PUT } from "@/app/api/league/route.ts";

let testAuthData = {}
let happyPathRequest = {}
const leagueConfigKey = "some_show_name:and_season_1";

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

deleteLeagueConfigurationData.mockImplementation(() => {
    return Promise.resolve();
});

const ourUserId = "ourUserId67C20C65-064D-444C-9AC0-DB5E14A38863";

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
                    return "testToken"
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
                    return {
                        session: "testToken"
                    }
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
                    return "testToken"
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
                    return "testToken"
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
                    return "testToken"
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
                    return "testToken"
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
                    return "testToken"
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
                    return "testToken"
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
                    return "testToken"
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
                    return "testToken"
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
                    return "testToken"
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
                    return "testToken"
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
                    return "testToken"
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
                    return "testToken"
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
                    return "testToken"
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
                    return "testToken"
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
                    return "testToken"
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
                    return "testToken"
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
                    return "testToken"
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
                    return "testToken"
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
                    return "testToken"
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
                    return "testToken"
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
                    return "testToken"
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
                    return "testToken"
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
                    return "testToken"
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
                    return "testToken"
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
                    return "testToken"
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
                    return "testToken"
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
                    return "testToken"
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
});

describe("PUT (unit tests)", () => {
    beforeEach(() => {
        happyPathRequest = {
            createdBy: ourUserId,
            leagueStatus: "active",
            leagueKey: leagueConfigKey
        };

        getUser.mockImplementation(() => {
            return Promise.resolve({
                role: "showAdmin"
            });
        });

        getAllKeys.mockImplementation(() => {
            return Promise.resolve([`league_configuration:${happyPathRequest.leagueStatus}:${happyPathRequest.leagueKey}`]);
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
        const dbContestantLeagueDataKeyPrefix = `${happyPathRequest.leagueKey}:*`;
        
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
                    return "testToken"
                })
            },
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest;
            })
        };

        // Act
        const response = await PUT(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(200);
        expect(request.json).toHaveBeenCalledTimes(1);
        expect(writeLeagueConfigurationData).toHaveBeenCalledTimes(1);
        expect(writeLeagueConfigurationData).toHaveBeenCalledWith(
            `league_configuration:${happyPathRequest.leagueStatus}:${dbContestantLeagueDataKeyPrefix}`,
            expect.objectContaining({
                createdBy: happyPathRequest.createdBy,
                leagueStatus: happyPathRequest.leagueStatus
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
                    return "testToken"
                })
            },
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest;
            })
        };

        // Act
        const response = await PUT(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(404);
    });

    it("should return a 409 when multiple league configurations found", async () => {
        // Arrange
        getAllKeys.mockImplementation(() => {
            return Promise.resolve([
                `league_configuration:active:${happyPathRequest.leagueKey}`,
                `league_configuration:inactive:${happyPathRequest.leagueKey}`
            ]);
        });
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return "testToken"
                })
            },
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest;
            })
        };

        // Act
        const response = await PUT(request);

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
                    return "testToken"
                })
            },
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest;
            })
        };

        // Act
        const response = await PUT(request);

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
                    return "testToken"
                })
            },
            json: jest.fn().mockImplementation(async () => invalidRequestBody)
        };

        // Act
        const response = await PUT(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(400);

        const rawBody = await response.body.getReader().read();
        const bodyString = new TextDecoder().decode(rawBody.value);
        expect(bodyString).toContain("leagueStatus");
    });

    it("should use wikiPageUrl, wikiApiUrl, castPhrase, and competitingEntityName from database when updating", async () => {
        // Arrange
        const dbWikiPageUrl = "https://en.wikipedia.org/wiki/Database_Page";
        const dbWikiApiUrl = "https://en.wikipedia.org/w/api.php?action=parse&format=json&page=Database_Page";
        const dbContestantLeagueDataKeyPrefix = `${happyPathRequest.leagueKey}:*`;
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
                    return "testToken"
                })
            },
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest;
            })
        };

        // Act
        const response = await PUT(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(200);
        expect(writeLeagueConfigurationData).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                wikiPageUrl: dbWikiPageUrl,
                wikiApiUrl: dbWikiApiUrl,
                castPhrase: dbCastPhrase,
                competitingEntityName: dbCompetitingEntityName
            })
        );
    });

    it("should call getAllKeys with correct league key pattern", async () => {
        // Arrange
        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return "testToken"
                })
            },
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest;
            })
        };

        // Act
        const response = await PUT(request);

        // Assert
        expect(response).not.toBeNull();
        expect(getAllKeys).toHaveBeenCalledWith(`league_configuration:*:${happyPathRequest.leagueKey}`);
    });

    it("should construct the write key using database contestantLeagueDataKeyPrefix", async () => {
        // Arrange
        const dbContestantLeagueDataKeyPrefix = `${happyPathRequest.leagueKey}:*`;
        getLeagueConfigurationData.mockImplementation(() => {
            return Promise.resolve({
                createdBy: ourUserId,
                leagueStatus: happyPathRequest.leagueStatus,
                wikiPageUrl: "https://en.wikipedia.org/wiki/Page",
                wikiApiUrl: "https://en.wikipedia.org/w/api.php",
                castPhrase: "Cast",
                competitingEntityName: "person",
                contestantLeagueDataKeyPrefix: dbContestantLeagueDataKeyPrefix
            });
        });

        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return "testToken"
                })
            },
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest;
            })
        };

        // Act
        const response = await PUT(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(200);
        expect(writeLeagueConfigurationData).toHaveBeenCalledWith(
            `league_configuration:${happyPathRequest.leagueStatus}:${dbContestantLeagueDataKeyPrefix}`,
            expect.anything()
        );
    });

    it("should delete the preexisting configuration when leagueStatus changes", async () => {
        // Arrange
        const preexistingLeagueConfigurationKey = `league_configuration:inactive:${happyPathRequest.leagueKey}`;
        const dbContestantLeagueDataKeyPrefix = `${happyPathRequest.leagueKey}:*`;
        
        getAllKeys.mockImplementation(() => {
            return Promise.resolve([preexistingLeagueConfigurationKey]);
        });

        getLeagueConfigurationData.mockImplementation(() => {
            return Promise.resolve({
                createdBy: ourUserId,
                leagueStatus: "inactive",
                wikiPageUrl: "https://en.wikipedia.org/wiki/Page",
                wikiApiUrl: "https://en.wikipedia.org/w/api.php",
                castPhrase: "Cast",
                competitingEntityName: "person",
                contestantLeagueDataKeyPrefix: dbContestantLeagueDataKeyPrefix
            });
        });

        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return "testToken"
                })
            },
            json: jest.fn().mockImplementation(async () => {
                return {
                    ...happyPathRequest,
                    leagueStatus: "active"
                };
            })
        };

        // Act
        const response = await PUT(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(200);
        expect(deleteLeagueConfigurationData).toHaveBeenCalledWith(preexistingLeagueConfigurationKey);
    });

    it("should not delete the preexisting configuration when leagueStatus does not change", async () => {
        // Arrange
        const preexistingLeagueConfigurationKey = `league_configuration:active:${happyPathRequest.leagueKey}`;
        const dbContestantLeagueDataKeyPrefix = `${happyPathRequest.leagueKey}:*`;
        
        getAllKeys.mockImplementation(() => {
            return Promise.resolve([preexistingLeagueConfigurationKey]);
        });

        getLeagueConfigurationData.mockImplementation(() => {
            return Promise.resolve({
                createdBy: ourUserId,
                leagueStatus: "active",
                wikiPageUrl: "https://en.wikipedia.org/wiki/Page",
                wikiApiUrl: "https://en.wikipedia.org/w/api.php",
                castPhrase: "Cast",
                competitingEntityName: "person",
                contestantLeagueDataKeyPrefix: dbContestantLeagueDataKeyPrefix
            });
        });

        deleteLeagueConfigurationData.mockClear();

        const request = {
            cookies: {
                get: jest.fn().mockImplementation(()=> {
                    return "testToken"
                })
            },
            json: jest.fn().mockImplementation(async () => {
                return happyPathRequest;
            })
        };

        // Act
        const response = await PUT(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(200);
        expect(deleteLeagueConfigurationData).not.toHaveBeenCalled();
    });
});
