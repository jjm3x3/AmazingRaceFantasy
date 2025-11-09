/**
 * @jest-environment node
 */

import { GET } from "@/app/api/backup/route.ts";

const aSecretValue = "iAmAVerySercretValue";

beforeEach(() => {
    process.env.CRON_SECRET = aSecretValue
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
});

