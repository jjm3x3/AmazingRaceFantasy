import { POST } from "@/app/api/league/route.ts";

describe("POST", () => {
    it("should return a 401 when auth token is missing", async () => {
        // Aarrange

        // Act
        await POST({});

        // Assert
    });
});
