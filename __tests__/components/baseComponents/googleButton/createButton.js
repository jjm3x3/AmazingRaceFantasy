import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import GoogleCreateButton from "../../../../app/components/baseComponents/googleButton/createButton";
import { SessionContext } from "@/app/contexts/session";
import { originalGoogle, mockGoogleAccounts, initializeGoogleMock, requestAccessTokenMock } from "../../../setupGoogleAccountsSdk";

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

describe("GoogleCreateButton Component", () => {
    it("should render a google login button", async () => {
        // setup
        const { getByTestId } = render(
            <SessionContext.Provider value={{ sessionInfo: mockSessionInfo, setSessionInfo: mockSetSessionInfo, googleSdkLoaded: mockgoogleSdkLoaded, setGoogleSdkLoaded: mockSetGoogleSdkLoaded }}>
                <GoogleCreateButton/>
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

    it("should redirect to / after login completed", async () => {
        // setup
        const fakeResponse = {
            json: () => new Promise((res,_rej) => {
                res({ name: { firstName: "AFirstName" } })
            })
        };
        const fetchPromise = { then: jest.fn((resolve) => {
            resolve(fakeResponse);
        })};
        window.fetch = jest.fn()
            .mockImplementation(() => fetchPromise);

        const { getByTestId } = render(
            <SessionContext.Provider value={{ sessionInfo: mockSessionInfo, setSessionInfo: mockSetSessionInfo, googleSdkLoaded: mockgoogleSdkLoaded, setGoogleSdkLoaded: mockSetGoogleSdkLoaded }}>
                <GoogleCreateButton/>
            </SessionContext.Provider>);

        // Act
        const googleBtnElm = getByTestId("google-test-btn");
        fireEvent.click(googleBtnElm);

        // Assert
        await waitFor(() => {
            expect(mockRouter.push).toHaveBeenCalledWith("/");
        });
    });
});
