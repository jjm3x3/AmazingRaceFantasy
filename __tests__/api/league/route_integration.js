/**
 * @jest-environment node
 */

import { POST } from "@/app/api/league/route.ts";


describe("POST", () => {
    it("should return a 401 when session token is missing", async () => {
        // Arrange
        const request = {
            cookies: {
                get: () => { return null}
            },
            json: async () => { return {} }
        };

        // Act
        const response = await POST(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(401);
    });

    it("should return a 401 when auth token is malformed (missing 3 parts)", async () => {
        // Arrange
        const request = {
            cookies: {
                get: () => { return {
                    session: "testToken"
                } }
            },
            json: async () => {}
        };

        // Act
        const response = await POST(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(401);
    });

    it("should return a 401 when auth token is malformed (parts are not base64 encoded json)", async () => {
        // Arrange
        const request = {
            cookies: {
                get: () => { return {
                    session: "someTokenHeader.someTokenBody.someTokenSig"
                } }
            },
            json: async () => { 
                return { 
                    token: "someTokenHeader.someTokenBody.someTokenSig" 
                }
            }
        };

        // Act
        const response = await POST(request);

        // Assert
        expect(response).not.toBeNull();
        expect(response.status).toEqual(401);
    });
});
