/**
 * @jest-environment node
 */

import { POST } from "@/app/api/league/route.ts";

describe("POST", () => {
    it("should return a 401 when auth token is missing", async () => {
        // Aarrange
        const request = {
            json: async () => { return {} }
        };

        // Act
        await POST(request);

        // Assert
    });
});
