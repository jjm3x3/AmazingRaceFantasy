import React from "react";
import { render, waitFor } from "@testing-library/react";
import GoogleLoginButton from "../../app/components/navigation/google-login-btn";
import { SessionProvider } from "@/app/contexts/session";

const originalGoogle = window.google; // Store original object
const initializeGoogleMock = jest.fn();
const requestAccessTokenMock = jest.fn().mockResolvedValue({ access_token: "mock_token" });
const getClientMock = jest.fn().mockReturnValue({
    requestAccessToken: requestAccessTokenMock,
});
const renderButtonMock = jest.fn().mockReturnValue(()=> {
    return <div data-testid="google-test-btn">This is my google button</div>
})
const mockGoogleAccounts = {
    id: {
        initialize: initializeGoogleMock,
        getClient: getClientMock,
        renderButton: renderButtonMock
    },
};

beforeEach(() => {
    window.google = { accounts: mockGoogleAccounts };
});

afterEach(() => {
    window.google = originalGoogle; // Restore original object
    jest.clearAllMocks();
});

describe("GoogleLoginButton Component", () => {
    it("should render a google login button", () => {
        const setState = jest.fn();
        jest.spyOn(React, "useState").mockReturnValue([true, setState]);
        const { getByTestId } = render(<SessionProvider><GoogleLoginButton /></SessionProvider>);
        expect(initializeGoogleMock).toHaveBeenCalled();
        waitFor(()=> {
            expect(requestAccessTokenMock).toHaveBeenCalled();
            const googleBtn = getByTestId("google-test-btn");
            expect(googleBtn).toExist();
            expect(googleBtn.innerText).toEqual("This is my google button")
        });
    });
});
