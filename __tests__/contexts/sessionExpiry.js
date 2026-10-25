import { render, act } from "@testing-library/react";
import { useContext } from "react";
import { SessionContext, SessionProvider } from "../../app/contexts/session";
import { clearLocalStorage } from "@/app/dataSources/localStorageShim";

jest.mock("../../app/dataSources/localStorageShim");

const mockRouter = { push: jest.fn() };
jest.mock("next/navigation", () => ({ useRouter: () => mockRouter }));

function LoggedInStatus() {
    const { sessionInfo } = useContext(SessionContext);
    return <p data-testid="status">{sessionInfo.isLoggedIn ? "in" : "out"}</p>;
}

const nowInSeconds = () => Math.floor(Date.now() / 1000);

beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    global.fetch = jest.fn().mockResolvedValue({ status: 205 });
});

afterEach(() => {
    jest.useRealTimers();
});

describe("SessionProvider expiry", () => {
    it("should start logged out and clear stale user data when there is no valid session", () => {
        const { getByTestId } = render(<SessionProvider sessionExpiresAt={null}><LoggedInStatus /></SessionProvider>);
        expect(getByTestId("status").textContent).toBe("out");
        expect(clearLocalStorage).toHaveBeenCalled();
    });

    it("should stay logged in before the session expires", () => {
        const { getByTestId } = render(<SessionProvider sessionExpiresAt={nowInSeconds() + 60}><LoggedInStatus /></SessionProvider>);
        act(() => { jest.advanceTimersByTime(30 * 1000); });
        expect(getByTestId("status").textContent).toBe("in");
        expect(clearLocalStorage).not.toHaveBeenCalled();
        expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it("should log the user out and redirect to the homepage when the session expires", async () => {
        const { getByTestId } = render(<SessionProvider sessionExpiresAt={nowInSeconds() + 60}><LoggedInStatus /></SessionProvider>);
        await act(async () => { jest.advanceTimersByTime(61 * 1000); });
        expect(getByTestId("status").textContent).toBe("out");
        expect(global.fetch).toHaveBeenCalledWith("/api/logout", { method: "POST" });
        expect(clearLocalStorage).toHaveBeenCalled();
        expect(mockRouter.push).toHaveBeenCalledWith("/");
    });

    it("should not log the user out when the logout request fails", async () => {
        global.fetch = jest.fn().mockRejectedValue(new Error("network down"));
        const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
        const { getByTestId } = render(<SessionProvider sessionExpiresAt={nowInSeconds() + 60}><LoggedInStatus /></SessionProvider>);
        await act(async () => { jest.advanceTimersByTime(61 * 1000); });
        expect(getByTestId("status").textContent).toBe("in");
        expect(warnSpy).toHaveBeenCalled();
        expect(clearLocalStorage).not.toHaveBeenCalled();
        expect(mockRouter.push).not.toHaveBeenCalled();
        warnSpy.mockRestore();
    });
});
