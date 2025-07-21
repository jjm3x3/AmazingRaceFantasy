import { render } from "@testing-library/react";
import { SessionProvider } from "../../app/contexts/session";
import Navigation from "../../app/components/navigation/navigation";

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
        const { getByTestId } = render(<SessionProvider sessionCookie={false}>
            <Navigation pages={pages}/>
        </SessionProvider>);
        expect(getByTestId("google-login-btn")).toBeTruthy();
    });
    
    it("should hide the login button if there is a session cookie", ()=> {
        const { queryByTestId } = render(<SessionProvider sessionCookie={true}>
            <Navigation pages={pages}/>
        </SessionProvider>);
        expect(queryByTestId("google-login-btn")).toBeFalsy();
    });
})

