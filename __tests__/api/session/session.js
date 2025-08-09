import { removeSession } from "@/app/api/session/session.tsx";

describe("removeSession", () => {
    it("Should call set on the response on happy path", async () => {

        // Arrange
        const requestMock = {
            cookies: {
                get: () => "a session cookie"
            }
        };

        const responseMock = {
            cookies: {
                set: jest.fn()
            }
        };

        // Act
        await removeSession(requestMock, responseMock);

        // Assert
        expect(responseMock.cookies.set).toBeCalled();
    });
});
