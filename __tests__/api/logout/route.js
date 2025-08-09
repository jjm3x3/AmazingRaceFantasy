/**
 * @jest-environment node
 */
import { POST } from "@/app/api/logout/route.ts";

describe("POST", () => {
    it("should be able to get a session cookie from header", async () => {

        // Arrange
        const requestMock = {
            url: "http://localhost:3000/api/logout",
            cookies: {
                get: () => "a session cookie"
            }
        };

        // Act
        const LogoutResponse = await POST(requestMock);

        // Assert
        expect(LogoutResponse).not.toBeNull();
    });

    it("should return a redirect", async () => {

        // Arrange
        const requestMock = {
            url: "http://localhost:3000/api/logout",
            cookies: {
                get: () => "a session cookie"
            }
        };

        // Act
        const LogoutResponse = await POST(requestMock);

        // Assert
        expect(LogoutResponse).not.toBeNull();
        expect(LogoutResponse.status).not.toBeNull();
        expect(LogoutResponse.status.toString()).toMatch(/^3/);
    });

    it("should return with a location header set", async () => {

        // Arrange
        const requestMock = {
            url: "http://localhost:3000/api/logout",
            cookies: {
                get: () => "a session cookie"
            }
        };

        // Act
        const LogoutResponse = await POST(requestMock);

        // Assert
        expect(LogoutResponse).not.toBeNull();
        expect(LogoutResponse.headers).not.toBeNull();
        expect(LogoutResponse.headers.get("location")).not.toBeNull();
    });
});
