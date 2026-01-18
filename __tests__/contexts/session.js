import { render } from "@testing-library/react";
import { SessionContext } from "../../app/contexts/session";
import Navigation from "../../app/components/navigation/navigation";

const mockgoogleSdkLoaded = true;
const mockSetGoogleSdkLoaded = jest.fn();
let mockSessionInfo = {
    isLoggedIn: false,
    userName: "Default User Name From Context",
    googleUserId: "xxx-xxx-xxx"
};
const mockSetSessionInfo = jest.fn();
const mockRouter = { push: jest.fn() };

jest.mock("next/navigation", () => ({ useRouter: () => { return mockRouter} }));

const pages = [
    {
        name: "Current",
        subpages: [
            {
                name: "Contestants",
                path: "/contestants",
            },
            {
                name: "Scoring",
                path: "/scoring",
            },
        ],
    },
    {
        name: "Past",
        subpages: [
            {
                name: "Contestants",
                path: "/archive/contestants",
            },
        ],
    },
];

describe("Session", ()=> {
    it("should show the login button if there is no session cookie", ()=> {
        const { getByTestId } = render(<SessionContext.Provider value={{ sessionInfo: mockSessionInfo, setSessionInfo: mockSetSessionInfo, googleSdkLoaded: mockgoogleSdkLoaded, setGoogleSdkLoaded: mockSetGoogleSdkLoaded }}>
            <Navigation pages={pages}/>
        </SessionContext.Provider>);
        expect(getByTestId("login-link")).toBeTruthy();
    });

    it("should hide the login link if there is a session cookie", ()=> {
        mockSessionInfo.isLoggedIn = true;
        const { queryByTestId } = render(<SessionContext.Provider value={{ sessionInfo: mockSessionInfo, setSessionInfo: mockSetSessionInfo, googleSdkLoaded: mockgoogleSdkLoaded, setGoogleSdkLoaded: mockSetGoogleSdkLoaded }}>
            <Navigation pages={pages}/>
        </SessionContext.Provider>);
        expect(queryByTestId("google-login-btn")).toBeFalsy();
    });
})

