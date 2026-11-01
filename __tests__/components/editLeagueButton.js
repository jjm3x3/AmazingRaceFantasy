import { render } from "@testing-library/react";
import EditLeagueButton from "../../app/components/editLeagueButton";
import { SessionContext } from "../../app/contexts/session";

const ownerUserId = "owner-user-id";
const editHref = "/league/active/big-brother-28/configuration";

function renderWithSession(sessionInfo, createdBy = ownerUserId) {
    return render(
        <SessionContext.Provider value={{ sessionInfo, setSessionInfo: jest.fn(), googleSdkLoaded: true, setGoogleSdkLoaded: jest.fn() }}>
            <EditLeagueButton createdBy={createdBy} editHref={editHref} />
        </SessionContext.Provider>
    );
}

describe("EditLeagueButton", () => {
    it("should render an enabled edit link to the league's edit page when the signed in user is the league owner", () => {
        const { getByTestId, queryByTestId } = renderWithSession({ userName: "Owner", googleUserId: "google-id", userId: ownerUserId, sessionExpiresAt: 4102444800 });
        const link = getByTestId("league-details-edit-link");
        expect(link).toHaveAttribute("href", editHref);
        expect(link).toHaveTextContent("Edit League");
        expect(queryByTestId("league-details-edit-button")).toBeNull();
    });

    it("should render the disabled button when the signed in user is not the league owner", () => {
        const { getByTestId, queryByTestId } = renderWithSession({ userName: "Someone", googleUserId: "google-id", userId: "different-user-id", sessionExpiresAt: 4102444800 });
        expect(getByTestId("league-details-edit-button")).toBeDisabled();
        expect(queryByTestId("league-details-edit-link")).toBeNull();
    });

    it("should render the disabled button when the user is signed out", () => {
        const { getByTestId, queryByTestId } = renderWithSession({ userName: null, googleUserId: null, userId: null, sessionExpiresAt: null });
        expect(getByTestId("league-details-edit-button")).toBeDisabled();
        expect(queryByTestId("league-details-edit-link")).toBeNull();
    });

    it("should render the disabled button when the user is signed out even if a stale user id matches the owner", () => {
        const { getByTestId, queryByTestId } = renderWithSession({ userName: null, googleUserId: null, userId: ownerUserId, sessionExpiresAt: null });
        expect(getByTestId("league-details-edit-button")).toBeDisabled();
        expect(queryByTestId("league-details-edit-link")).toBeNull();
    });

    it("should render the disabled button when the league has no stored owner", () => {
        const { getByTestId, queryByTestId } = renderWithSession({ userName: "Someone", googleUserId: "google-id", userId: undefined, sessionExpiresAt: 4102444800 }, undefined);
        expect(getByTestId("league-details-edit-button")).toBeDisabled();
        expect(queryByTestId("league-details-edit-link")).toBeNull();
    });
});
