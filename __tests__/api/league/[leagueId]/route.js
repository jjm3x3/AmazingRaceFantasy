/**
 * @jest-environment node
 */

jest.mock("../../../../app/dataSources/dbFetch");
import * as sessionModule from "../../../../app/api/session/session";
import { getAllKeys, getLeagueConfigurationData, updateLeagueConfigurationData } from "@/app/dataSources/dbFetch";
import { PUT } from "@/app/api/league/[leagueId]/route.ts";

const ourUserId = "ourUserId67C20C65-064D-444C-9AC0-DB5E14A38863";
const validSessionCookie = { name: "session", value: "header.payload.signature" };
const leagueId = "some_show_name:and_season_1";
const storedLeagueConfigurationKey = `league_configuration:active:${leagueId}`;

let happyPathRequest = {};
let storedLeagueConfiguration = {};

jest.mock("../../../../app/api/session/session", ()=> {
    const actual = jest.requireActual("../../../../app/api/session/session");
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
});

const makeRequest = (body, sessionCookie = validSessionCookie) => ({
    cookies: {
        get: jest.fn().mockImplementation(()=> sessionCookie)
    },
    json: jest.fn().mockImplementation(async () => body)
});

const makeContext = (id = leagueId) => ({ params: Promise.resolve({ leagueId: id }) });

const readBody = async (response) => {
    const rawBody = await response.body.getReader().read();
    return new TextDecoder().decode(rawBody.value);
};

beforeEach(() => {
    happyPathRequest = {
        wikiPageName: "New_Page_(season)",
        wikiSectionHeader: "HouseGuests",
        contestantType: "team",
        leagueStatus: "active",
        googleSheetUrl: "https://some.url"
    };

    storedLeagueConfiguration = {
        wikiPageUrl: "https://en.wikipedia.org/wiki/Original_Page",
        wikiApiUrl: "https://en.wikipedia.org/w/api.php?action=parse&format=json&page=Original_Page",
        googleSheetUrl: "https://original.url",
        leagueStatus: "active",
        castPhrase: "Original Cast",
        preGoogleSheetsLinkText: "stored pre text",
        postGoogleSheetsLinkText: "stored post text",
        competitingEntityName: "person",
        contestantLeagueDataKeyPrefix: `${leagueId}:*`,
        createdBy: ourUserId
    };

    getAllKeys.mockImplementation(() => Promise.resolve([storedLeagueConfigurationKey]));
    getLeagueConfigurationData.mockImplementation(() => Promise.resolve(storedLeagueConfiguration));
    updateLeagueConfigurationData.mockImplementation(() => Promise.resolve());
});

afterEach(() => {
    jest.clearAllMocks();
});

describe("PUT (unit tests)", () => {
    it("should return 200 when PUT conditions met", async () => {
        // Act
        const response = await PUT(makeRequest(happyPathRequest), makeContext());

        // Assert
        expect(response.status).toEqual(200);
        expect(await readBody(response)).toContain("updated");
        expect(updateLeagueConfigurationData).toHaveBeenCalledTimes(1);
    });

    it("should call getAllKeys with the league id from the path", async () => {
        // Act
        await PUT(makeRequest(happyPathRequest), makeContext());

        // Assert
        expect(getAllKeys).toHaveBeenCalledWith(`league_configuration:*:${leagueId}`);
    });

    it("should ignore leagueKey and createdBy in the body", async () => {
        // Arrange
        const request = makeRequest({
            ...happyPathRequest,
            leagueKey: "other_show:2",
            createdBy: "someoneElse"
        });

        // Act
        const response = await PUT(request, makeContext());

        // Assert
        expect(response.status).toEqual(200);
        expect(getAllKeys).toHaveBeenCalledWith(`league_configuration:*:${leagueId}`);
        expect(updateLeagueConfigurationData).toHaveBeenCalledWith(
            storedLeagueConfigurationKey,
            expect.objectContaining({ createdBy: ourUserId })
        );
    });

    it("should return a 404 when no league configuration found", async () => {
        // Arrange
        getAllKeys.mockImplementation(() => Promise.resolve([]));

        // Act
        const response = await PUT(makeRequest(happyPathRequest), makeContext());

        // Assert
        expect(response.status).toEqual(404);
        expect(updateLeagueConfigurationData).not.toHaveBeenCalled();
    });

    it("should return a 409 when multiple league configurations found", async () => {
        // Arrange
        getAllKeys.mockImplementation(() => Promise.resolve([
            `league_configuration:active:${leagueId}`,
            `league_configuration:archive:${leagueId}`
        ]));

        // Act
        const response = await PUT(makeRequest(happyPathRequest), makeContext());

        // Assert
        expect(response.status).toEqual(409);
        expect(updateLeagueConfigurationData).not.toHaveBeenCalled();
    });

    it("should return a 403 when PUT userId does not match createdBy from database", async () => {
        // Arrange
        storedLeagueConfiguration.createdBy = "differentUser";

        // Act
        const response = await PUT(makeRequest(happyPathRequest), makeContext());

        // Assert
        expect(response.status).toEqual(403);
        expect(updateLeagueConfigurationData).not.toHaveBeenCalled();
    });

    it("should derive wikiPageUrl and wikiApiUrl from wikiPageName", async () => {
        // Act
        await PUT(makeRequest(happyPathRequest), makeContext());

        // Assert
        expect(updateLeagueConfigurationData).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                wikiPageUrl: "https://en.wikipedia.org/wiki/New_Page_(season)",
                wikiApiUrl: "https://en.wikipedia.org/w/api.php?action=parse&format=json&page=New_Page_(season)"
            })
        );
    });

    it("should store the editable fields under their stored names", async () => {
        // Act
        await PUT(makeRequest(happyPathRequest), makeContext());

        // Assert
        expect(updateLeagueConfigurationData).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                castPhrase: happyPathRequest.wikiSectionHeader,
                competitingEntityName: happyPathRequest.contestantType,
                leagueStatus: happyPathRequest.leagueStatus,
                googleSheetUrl: happyPathRequest.googleSheetUrl
            })
        );
    });

    it("should keep the stored fields that are not editable", async () => {
        // Arrange
        storedLeagueConfiguration.parserOptions = { dayOverrides: [11, 13] };

        // Act
        await PUT(makeRequest(happyPathRequest), makeContext());

        // Assert
        expect(updateLeagueConfigurationData).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                preGoogleSheetsLinkText: storedLeagueConfiguration.preGoogleSheetsLinkText,
                postGoogleSheetsLinkText: storedLeagueConfiguration.postGoogleSheetsLinkText,
                contestantLeagueDataKeyPrefix: storedLeagueConfiguration.contestantLeagueDataKeyPrefix,
                createdBy: ourUserId,
                parserOptions: { dayOverrides: [11, 13] }
            })
        );
    });

    it("should not add parserOptions when none are stored", async () => {
        // Act
        await PUT(makeRequest(happyPathRequest), makeContext());

        // Assert
        const writtenConfig = updateLeagueConfigurationData.mock.calls[0][1];
        expect(writtenConfig).not.toHaveProperty("parserOptions");
    });

    it("should use the existing league configuration key from the database as the update key", async () => {
        // Arrange
        const archivedKey = `league_configuration:archive:${leagueId}`;
        getAllKeys.mockImplementation(() => Promise.resolve([archivedKey]));
        storedLeagueConfiguration.leagueStatus = "archive";

        // Act
        const response = await PUT(makeRequest(happyPathRequest), makeContext());

        // Assert
        expect(response.status).toEqual(200);
        expect(getLeagueConfigurationData).toHaveBeenCalledWith(archivedKey);
        expect(updateLeagueConfigurationData).toHaveBeenCalledWith(
            archivedKey,
            expect.objectContaining({ leagueStatus: "active" })
        );
    });

    it.each([
        ["has a space", "some show:1"],
        ["has a '*'", "some_show:*"],
        ["is empty", ""]
    ])("should return a 400 when the path leagueId %s", async (_description, invalidLeagueId) => {
        // Act
        const response = await PUT(makeRequest(happyPathRequest), makeContext(invalidLeagueId));

        // Assert
        expect(response.status).toEqual(400);
        expect(await readBody(response)).toContain("leagueId");
        expect(getAllKeys).not.toHaveBeenCalled();
    });

    it.each([
        "wikiPageName",
        "wikiSectionHeader",
        "contestantType",
        "leagueStatus",
        "googleSheetUrl"
    ])("should return a 400 when PUT is missing %s", async (property) => {
        // Arrange
        delete happyPathRequest[property];

        // Act
        const response = await PUT(makeRequest(happyPathRequest), makeContext());

        // Assert
        expect(response.status).toEqual(400);
        expect(await readBody(response)).toContain(property);
        expect(updateLeagueConfigurationData).not.toHaveBeenCalled();
    });

    it.each([
        ["wikiPageName", "has whitespace", "Some Page"],
        ["leagueStatus", "is not a known status", "maybe-active"],
        ["googleSheetUrl", "is not a url", "not a url"],
        ["googleSheetUrl", "has no scheme", "sup"],
        ["googleSheetUrl", "does not use https", "http://some.url"],
        ["googleSheetUrl", "has an invalid domain", "https:sup_blah_{_ga*b;ge_d^ta"]
    ])("should return a 400 when PUT %s %s", async (property, _description, invalidValue) => {
        // Arrange
        happyPathRequest[property] = invalidValue;

        // Act
        const response = await PUT(makeRequest(happyPathRequest), makeContext());

        // Assert
        expect(response.status).toEqual(400);
        expect(await readBody(response)).toContain(property);
        expect(updateLeagueConfigurationData).not.toHaveBeenCalled();
    });

    it("should return a 401 when PUT session cookie is missing", async () => {
        // Act
        const response = await PUT(makeRequest(happyPathRequest, null), makeContext());

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
        // Act
        const response = await PUT(makeRequest(happyPathRequest, { name: "session", value: cookieValue }), makeContext());

        // Assert
        expect(response.status).toEqual(401);
        expect(sessionModule.decrypt).not.toHaveBeenCalled();
    });

    it("should return a 401 when PUT session cookie decrypts without a sub claim", async () => {
        // Arrange
        jest.spyOn(sessionModule, "decrypt").mockImplementationOnce(()=> ({ iat: "", exp: "" }));

        // Act
        const response = await PUT(makeRequest(happyPathRequest), makeContext());

        // Assert
        expect(response.status).toEqual(401);
        expect(updateLeagueConfigurationData).not.toHaveBeenCalled();
    });
});
