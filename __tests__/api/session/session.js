import { removeSession } from "@/app/api/session/session.tsx";

beforeEach(() => {
    global.conosle = {
        log: jest.fn(),
        warn: jest.spyOn(console, "warn").mockImplementation(() => {}),
    };
});

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

    it("Should log a warning when sessionCookie is not found", async () => {

        // Arrange
        const requestMock = {
            cookies: {
                get: () => undefined
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
        expect(console.warn).toHaveBeenCalled();
    });
});
