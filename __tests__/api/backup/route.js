/**
 * @jest-environment node
 */

import { GET } from "@/app/api/backup/route.ts";

describe("backup GET", () => {
    it("should pass", () => {
        // Arrange
        const request = {
            headers: { get: () => "Bearer someToken" }
        };

        // Act
        const response = GET(request);

        // Assert
        expect(response).not.toBeNull();
    });
});
