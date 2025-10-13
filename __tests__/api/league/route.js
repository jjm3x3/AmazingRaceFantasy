/**
 * @jest-environment node
 */

jest.mock("google-auth-library");
jest.mock("../../../app/dataSources/dbFetch");
import * as sessionModule from "../../../app/api/session/session";
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

jest.mock("../../../app/api/session/session", ()=> {
    const actual = jest.requireActual("../../../app/api/session/session");
    return {
        ...actual,
        decrypt: jest.fn().mockImplementation(()=> {
            return {
                sub: "108251633753098119380",
                ias: "",
                exp: ""
            }
        })
    }
})



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

afterEach(() => {
    jest.clearAllMocks();
});

describe("POST (unit tests)", () => {
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

    it("should accept a user friendly leagueStatus", async () => {
        // Aarrange
        happyPathRequest.leagueStatus = "archived";
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

    it("should call writeLeagueConfigurationData with archive when request.leagueStatus is archived", async () => {
        // Arrange
        const modifiedRequest = happyPathRequest;
        modifiedRequest.leagueStatus = "archived";
        const expectedLeagueStatus = "archive";
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
                "leagueStatus": expectedLeagueStatus,
            }));
    });

    it("should call writeLeagueConfigurationData with the same leagueStatus as is used in the key", async () => {
        // Arrange
        const modifiedRequest = happyPathRequest;
        modifiedRequest.leagueStatus = "archived";
        const expectedLeagueStatus = "archive";
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
                "leagueStatus": expectedLeagueStatus,
            }));
        expect(writeLeagueConfigurationData).toHaveBeenCalledWith(
            expect.stringContaining(expectedLeagueStatus + ":"), // adding the ":" to avoid the "archived" key segment
            expect.anything());
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
});
