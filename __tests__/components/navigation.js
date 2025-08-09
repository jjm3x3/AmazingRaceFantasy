import { render, fireEvent, waitFor } from "@testing-library/react";
import Navigation from "../../app/components/navigation/navigation";

describe("Navigation Component", () => {
    it("should render a hamburger navigation if there are pages found", async () => {
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
        const { getByTestId } = render(<Navigation pages={pages} />);
        expect(getByTestId("navigation")).toBeTruthy();
        const toggleButton = getByTestId("hamburger-nav-btn");
        const navMenu = getByTestId("navigation-menu");
        expect(toggleButton).toBeTruthy();
        expect(navMenu).not.toBeVisible();
        fireEvent.click(toggleButton);
        waitFor(() => {
            expect(navMenu).toBeVisible();
        });
        const subPageToggle = getByTestId("subpage-current-label");
        const subPageList = getByTestId("subpage-current-dropdown");
        expect(subPageToggle).toBeTruthy();
        expect(subPageList).not.toBeVisible();
        fireEvent.click(subPageToggle);
        waitFor(() => {
            expect(subPageList).toBeVisible();
        });
    });

    it("should render a google login button if the client does not have a session cookie", async () => {
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
        const { getByTestId } = render(<Navigation pages={pages} />);
        expect(getByTestId("navigation")).toBeTruthy();

        const toggleButton = getByTestId("hamburger-nav-btn");
        const navMenu = getByTestId("navigation-menu");
        expect(toggleButton).toBeTruthy();
        expect(navMenu).not.toBeVisible();
        fireEvent.click(toggleButton);
        waitFor(() => {
            expect(navMenu).toBeVisible();
        });

        const googleLoginButton = getByTestId("google-login-btn");
        expect(googleLoginButton).toBeVisible();
    });
});
