import React from "react";
import { render, waitFor } from "@testing-library/react";
import GoogleLoginButton from "../../app/components/navigation/google-login-btn";
import { SessionContext } from "@/app/contexts/session";
import { originalGoogle, mockGoogleAccounts, initializeGoogleMock, requestAccessTokenMock } from "../setupGoogleAccountsSdk";
import { useRouter } from "next/navigation";

const mockRouter = { push: jest.fn() };

jest.mock("next/navigation", () => ({ useRouter: () => { return mockRouter} }));

beforeEach(() => {
    window.google = { accounts: mockGoogleAccounts };
});

afterEach(() => {
    window.google = originalGoogle; // Restore original object
});

const mockgoogleSdkLoaded = true;
const mockSetGoogleSdkLoaded = jest.fn();
let mockSessionInfo = {
    isLoggedIn: false,
    userName: "Default User Name From Context",
    googleUserId: "xxx-xxx-xxx"
};
const mockSetSessionInfo = jest.fn();

describe("GoogleLoginButton Component", () => {
    it("should render a google login button", async () => {
        // setup
        const { getByTestId } = render(
            <SessionContext.Provider value={{ sessionInfo: mockSessionInfo, setSessionInfo: mockSetSessionInfo, googleSdkLoaded: mockgoogleSdkLoaded, setGoogleSdkLoaded: mockSetGoogleSdkLoaded }}>
                <GoogleLoginButton/>
            </SessionContext.Provider>);
        
        // assert
        await waitFor(()=> {
            expect(initializeGoogleMock).toHaveBeenCalled();
            expect(requestAccessTokenMock).toHaveBeenCalled();
            const googleBtnElm = getByTestId("google-test-btn");
            expect(googleBtnElm).toBeTruthy();
            expect(googleBtnElm.textContent).toEqual("This is my google button");
        });
    });
});
