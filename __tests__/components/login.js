import { render, fireEvent, waitFor } from "@testing-library/react";
import LoginComponent from "@/app/components/loginComponent/loginComponent";
import { SessionContext } from "@/app/contexts/session";
import { originalGoogle, getMockGoogleAccount, initializeGoogleMock, requestAccessTokenMock } from "../setupGoogleAccountsSdk";

const mockRouter = { push: jest.fn() };

jest.mock("next/navigation", () => ({ useRouter: () => { return mockRouter} }));

beforeEach(() => {
    window.google = { accounts: getMockGoogleAccount("google_btn") };
    initializeGoogleMock.mockClear();
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

describe("Login Component", () => {
    it("should render a google button", async () => {
        // setup
        const { getByTestId } = render(
            <SessionContext.Provider value={{ sessionInfo: mockSessionInfo, setSessionInfo: mockSetSessionInfo, googleSdkLoaded: mockgoogleSdkLoaded, setGoogleSdkLoaded: mockSetGoogleSdkLoaded }}>
                <LoginComponent/>
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

    it("should display an error when create returns a 404", async () => {
        // setup
        const fakeResponse = {
            status: 404
        };
        const fetchPromise = { then: jest.fn((resolve) => {
            resolve(fakeResponse);
        })};
        window.fetch = jest.fn()
            .mockImplementation(() => fetchPromise);

        const { getByTestId } = render(
            <SessionContext.Provider value={{ sessionInfo: mockSessionInfo, setSessionInfo: mockSetSessionInfo, googleSdkLoaded: mockgoogleSdkLoaded, setGoogleSdkLoaded: mockSetGoogleSdkLoaded }}>
                <LoginComponent/>
            </SessionContext.Provider>);

        // Act
        const googleBtnElm = getByTestId("google-test-btn");
        fireEvent.click(googleBtnElm);

        // Assert
        await waitFor(() => {
            const errorElement = getByTestId("login-error");
            expect(errorElement).toBeTruthy();
            expect(errorElement.textContent).toEqual("!There was no account found. Try creating one.");
        });
    });

    it("should display an error when create returns a 401", async () => {
        // setup
        const fakeResponse = {
            status: 401
        };
        const fetchPromise = { then: jest.fn((resolve) => {
            resolve(fakeResponse);
        })};
        window.fetch = jest.fn()
            .mockImplementation(() => fetchPromise);

        const { getByTestId } = render(
            <SessionContext.Provider value={{ sessionInfo: mockSessionInfo, setSessionInfo: mockSetSessionInfo, googleSdkLoaded: mockgoogleSdkLoaded, setGoogleSdkLoaded: mockSetGoogleSdkLoaded }}>
                <LoginComponent/>
            </SessionContext.Provider>);

        // Act
        const googleBtnElm = getByTestId("google-test-btn");
        fireEvent.click(googleBtnElm);

        // Assert
        await waitFor(() => {
            const errorElement = getByTestId("login-error");
            expect(errorElement).toBeTruthy();
            expect(errorElement.textContent).toEqual("!There was an issue logging in. Please try again.");
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
                <LoginComponent/>
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