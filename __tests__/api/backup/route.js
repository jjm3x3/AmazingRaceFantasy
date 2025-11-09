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
});

