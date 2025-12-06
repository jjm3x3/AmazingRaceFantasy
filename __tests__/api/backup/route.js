/**
 * @jest-environment node
 */

jest.mock("../../../app/dataSources/dbFetch");
jest.mock("../../../app/dataSources/s3Provider");
import { GET } from "@/app/api/backup/route.ts";
import { saveObject } from "@/app/dataSources/s3Provider";
import { getAllKeys } from "@/app/dataSources/dbFetch";

const aSecretValue = "iAmAVerySercretValue";

beforeEach(() => {
    process.env.CRON_SECRET = aSecretValue

    jest.resetAllMocks()

    saveObject.mockImplementation(() => {
        return new Promise((resolve, _reject) => {
            resolve({key: "value"});
        });
    });

    getAllKeys.mockImplementation(() => {
        return new Promise((resolve, _reject) => {
            resolve(["aKey", "aSecondKey"]);
        });
    });
});

describe("backup GET", () => {

    it("should pass when the secret is provided", async () => {
        // Arrange
        const request = {
            headers: { get: () => `Bearer ${aSecretValue}` }
        };

        // Act
        const response = await GET(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(200);
    });

    it("should fail with a 401 when the secret is not provided", async () => {
        // Arrange
        const request = {
            headers: { get: () => "" } // no secret
        };

        // Act
        const response = await GET(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(401);
    });

    it("should call saveObject from an s3Provider layer", async () => {
        // Arrange
        const request = {
            headers: { get: () => `Bearer ${aSecretValue}` }
        };

        // Act
        await GET(request);

        // Assert
        expect(saveObject).toHaveBeenCalled();
    });

    it("should call catch when one of individual saves fails", async () => {
        // Arrange
        saveObject
            .mockReturnValue(new Promise((resolve, _reject) => {
                resolve({key: "value"});
            }))
            .mockReturnValue(new Promise((_resolve, reject) => {
                reject({key: "value"});
            }));

        const request = {
            headers: { get: () => `Bearer ${aSecretValue}` }
        };

        // Act
        const response = await GET(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(500);
    });

    it("should call catch when one get keys fails", async () => {
        // Arrange
        getAllKeys
            .mockReturnValue(new Promise((_resolve, reject) => {
                reject(new Error("I am an error"));
            }));

        const request = {
            headers: { get: () => `Bearer ${aSecretValue}` }
        };

        // Act
        const response = await GET(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(500);
    });
});

