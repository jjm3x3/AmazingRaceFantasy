import { render, fireEvent, waitFor } from "@testing-library/react";
import Navigation from "../../app/components/navigation/navigation";
import { SessionContext } from "../../app/contexts/session";
import { originalGoogle, mockGoogleAccounts } from "../setupGoogleAccountsSdk";

const mockgoogleSdkLoaded = true;
const mockSetGoogleSdkLoaded = jest.fn();
let mockSessionInfo = {
    isLoggedIn: false,
    userName: "Default User Name From Context",
    googleUserId: "xxx-xxx-xxx"
};
const mockSetSessionInfo = jest.fn();

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

const mockRouter = { push: jest.fn() };

jest.mock("next/navigation", () => ({ useRouter: () => { return mockRouter} }));

describe("Navigation Component", () => {
    beforeEach(()=> {
        mockSessionInfo = {
            isLoggedIn: false,
            userName: "Default User Name From Context",
            googleUserId: "xxx-xxx-xxx"
        }
        window.google = { accounts: mockGoogleAccounts };
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                status: 205,
                json: () => Promise.resolve({ 
                    name: {
                        firstName: "Test",
                        googleUserId: "Test"
                    }
                }),
            })
        );

    });

    afterEach(()=> {
        window.google = originalGoogle; // Restore original object
        jest.clearAllMocks();
    })

    it("should render a hamburger navigation if there are pages found", async () => {
        // setup
        const { getByTestId } = render(<Navigation pages={pages} />);
        const toggleButton = getByTestId("hamburger-nav-btn");
        const navMenu = getByTestId("navigation-menu");

        // assert
        expect(getByTestId("navigation")).toBeTruthy();
        expect(toggleButton).toBeTruthy();
        expect(navMenu).not.toBeVisible();

        // act
        fireEvent.click(toggleButton);

        // assert
        await waitFor(() => {
            expect(navMenu).toBeVisible();
        });

        // setup
        const subPageToggle = getByTestId("subpage-current-label");
        const subPageList = getByTestId("subpage-current-dropdown");

        // assert
        expect(subPageToggle).toBeTruthy();
        expect(subPageList).not.toBeVisible();

        // act
        fireEvent.click(subPageToggle);

        // assert
        await waitFor(() => {
            expect(subPageList).toBeVisible();
        });
    });

    it("should render a login link if the client does not have a session cookie", async () => {
        // setup
        const { getByTestId } = render(<SessionContext.Provider value={{ sessionInfo: mockSessionInfo, setSessionInfo: mockSetSessionInfo, googleSdkLoaded: mockgoogleSdkLoaded, setGoogleSdkLoaded: mockSetGoogleSdkLoaded }}><Navigation pages={pages} /></SessionContext.Provider>);
        const toggleButton = getByTestId("hamburger-nav-btn");
        const navMenu = getByTestId("navigation-menu");
        
        // assert
        expect(getByTestId("navigation")).toBeTruthy();
        expect(toggleButton).toBeTruthy();
        expect(navMenu).not.toBeVisible();

        // act
        fireEvent.click(toggleButton);

        // assert
        await waitFor(() => {
            expect(navMenu).toBeVisible();
        });

        // setup
        const googleLoginButton = getByTestId("login-link");

        // assert
        expect(googleLoginButton).toBeVisible();
    });

    it("should render a logout button if the client does not have a session cookie", async () => {
        // setup
        mockSessionInfo.isLoggedIn = true;
        const { getByTestId } = render(
            <SessionContext.Provider value={{ sessionInfo: mockSessionInfo, setSessionInfo: mockSetSessionInfo, googleSdkLoaded: mockgoogleSdkLoaded, setGoogleSdkLoaded: mockSetGoogleSdkLoaded }}>
                <Navigation pages={pages} />
            </SessionContext.Provider>);
        const toggleButton = getByTestId("hamburger-nav-btn");
        const navMenu = getByTestId("navigation-menu");

        // assert
        expect(getByTestId("navigation")).toBeTruthy();
        expect(toggleButton).toBeTruthy();
        expect(navMenu).not.toBeVisible();

        // act
        fireEvent.click(toggleButton);

        // assert
        await waitFor(() => {
            expect(navMenu).toBeVisible();
        });

        // setup
        const logoutButton = getByTestId("logout-btn");

        // assert
        expect(logoutButton).toBeVisible();
    });

    it("should hide navigation on login complete", async () => {
        // setup
        mockSessionInfo.isLoggedIn = false;
        const { getByTestId } = render(
            <SessionContext.Provider value={{ sessionInfo: mockSessionInfo, setSessionInfo: mockSetSessionInfo, googleSdkLoaded: mockgoogleSdkLoaded, setGoogleSdkLoaded: mockSetGoogleSdkLoaded }}>
                <Navigation pages={pages} />
            </SessionContext.Provider>);
        const toggleButton = getByTestId("hamburger-nav-btn");
        const navMenu = getByTestId("navigation-menu");

        // Act
        fireEvent.click(toggleButton);
        await waitFor(()=> {
            // Need to wait for the navigation hydration to cycle through and rerender the navigation in opened state
            const loginBtn = getByTestId("google-test-btn");
            fireEvent.click(loginBtn);
        });
        await waitFor(()=> {
            // Need to wait for the login flow to cycle through and rerender the navigation in closed state
            expect(navMenu).not.toBeVisible();
        }); 
    });

    it("should close the navigation on logout", async ()=> {
        mockSessionInfo.isLoggedIn = true;
        const { getByTestId } = render(
            <SessionContext.Provider value={{ sessionInfo: mockSessionInfo, setSessionInfo: mockSetSessionInfo, googleSdkLoaded: mockgoogleSdkLoaded, setGoogleSdkLoaded: mockSetGoogleSdkLoaded }}>
                <Navigation pages={pages} />
            </SessionContext.Provider>
        );
        const toggleButton = getByTestId("hamburger-nav-btn");
        const navMenu = getByTestId("navigation-menu");
        // Act
        fireEvent.click(toggleButton);
        await waitFor(()=> {
            // Need to wait for the navigation hydration to cycle through and rerender the navigation in opened state
            const logoutBtn = getByTestId("logout-button-core");
            fireEvent.click(logoutBtn);
        });
        
        await waitFor(()=> {
            // Need to wait for the login flow to cycle through and rerender the navigation in closed state
            expect(navMenu).not.toBeVisible();
        }); 
    });
});
