import React from "react";
import { render, waitFor } from "@testing-library/react";
import GoogleLoginButton from "../../app/components/navigation/google-login-btn";
import { SessionProvider } from "@/app/contexts/session";
import { originalGoogle, mockGoogleAccounts, initializeGoogleMock, requestAccessTokenMock } from "../setupGoogleLoginButton";

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
