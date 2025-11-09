/**
 * @jest-environment node
 */

import { GET } from "@/app/api/backup/route.ts";

describe("backup GET", () => {

    it("should pass when the secret is provided", async () => {
        // Arrange
        const request = {
            headers: { get: () => "Bearer someToken" }
        };

        // Act
        const response = await GET(request);

        // Assert
        expect(response).not.toBeNull();
    });
});
