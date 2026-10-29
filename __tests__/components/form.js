import { render, fireEvent, waitFor } from "@testing-library/react";
import LeagueConfigurationForm from "@/app/league/configuration/form/form.tsx";
import { UNAUTHENTICATED_ERROR_MESSAGE, UNAUTHORIZED_ERROR_MESSAGE, GENERIC_FORM_ERROR_MESSAGE, LEAGUE_NOT_FOUND_ERROR_MESSAGE } from "@/app/dataSources/errorMsgs";

const mockRouterPush = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter() {
        return {
            prefetch: () => null,
            push: mockRouterPush
        };
    }
}));

const testFormData = {
    wikiPageName: "test",
    wikiSectionHeader: "test",
    showName: "amazing_race",
    showSeason: "37",
    contestantType: "test with space",
    leagueStatus: "active",
    googleSheetUrl: "https://test.com"
}

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ test: 100 }),
    }),
);

const leagueConfigFetchSuccessMock = () => Promise.resolve({
    ok: true,
    status: 200,
    json: () => {
        return new Promise((res,_rej) => {
            res({message: "some text from the server"})
        });
    }
});

const leagueConfigFetch401ErrorMock = () => Promise.resolve({
    ok: false,
    status: 401,
    json: async () => {}
});

describe("LeagueConfigurationForm", ()=> {
    let fetchMock = undefined;

    beforeEach(() => {
        fetchMock = jest.spyOn(global, "fetch")
            .mockImplementation(leagueConfigFetchSuccessMock);
    });

    it("should render a form", ()=> {
        const { getByTestId } = render(<LeagueConfigurationForm/>);

        // assert
        expect(getByTestId("test-input-wikiPageName")).toBeTruthy();
        expect(getByTestId("test-input-wikiSectionHeader")).toBeTruthy();
        expect(getByTestId("test-select-leagueStatus")).toBeTruthy();
    });

    it("should submit a form on success", ()=> {
        const { getByTestId, queryByTestId } = render(<LeagueConfigurationForm/>);

        // act
        const wikiPageNameElm = getByTestId("test-input-wikiPageName");
        fireEvent.change(wikiPageNameElm, {target: { value: testFormData.wikiPageName }});
        const wikiSectionHeaderElm = getByTestId("test-input-wikiSectionHeader");
        fireEvent.change(wikiSectionHeaderElm, {target: { value: testFormData.wikiSectionHeader }});
        const showNameElm = getByTestId("test-select-showName");
        fireEvent.change(showNameElm, {target: { value: testFormData.showName }});
        const showSeasonElm = getByTestId("test-input-showSeason");
        fireEvent.change(showSeasonElm, {target: { value: testFormData.showSeason }});
        const contestantTypeElm = getByTestId("test-input-contestantType");
        fireEvent.change(contestantTypeElm, {target: { value: testFormData.contestantType }});
        const leagueStatusElm = getByTestId("test-select-leagueStatus");
        fireEvent.change(leagueStatusElm, {target: { value: testFormData.leagueStatus }});
        const googleSheetUrlElm = getByTestId("test-input-googleSheetUrl");
        fireEvent.change(googleSheetUrlElm, {target: { value: testFormData.googleSheetUrl }});
        fireEvent.click(getByTestId("test-button-leagueConfigurationSubmit"));

        // assert
        expect(fetchMock).toHaveBeenCalled();
        expect(queryByTestId("leagueConfiguration-form-submission-error")).not.toBeTruthy();
    });

    it("should submit a request with a valid status enum when archived is selected status", async ()=> {
        // arrange
        const { getByTestId, queryByTestId } = render(<LeagueConfigurationForm/>);
        const wikiPageNameElm = getByTestId("test-input-wikiPageName");
        const wikiSectionHeaderElm = getByTestId("test-input-wikiSectionHeader");
        const showNameElm = getByTestId("test-select-showName");
        const showSeasonElm = getByTestId("test-input-showSeason");
        const contestantTypeElm = getByTestId("test-input-contestantType");
        const leagueStatusElm = getByTestId("test-select-leagueStatus");
        const googleSheetUrlElm = getByTestId("test-input-googleSheetUrl");
        
        fireEvent.change(wikiPageNameElm, {target: { value: testFormData.wikiPageName }});
        fireEvent.change(wikiSectionHeaderElm, {target: { value: testFormData.wikiSectionHeader }});
        fireEvent.change(showNameElm, {target: { value: testFormData.showName }});
        fireEvent.change(showSeasonElm, {target: { value: testFormData.showSeason }});
        fireEvent.change(contestantTypeElm, {target: { value: testFormData.contestantType }});
        fireEvent.change(googleSheetUrlElm, {target: { value: testFormData.googleSheetUrl }});

        // act
        fireEvent.change(leagueStatusElm, {target: { value: "archived" }});
        fireEvent.click(getByTestId("test-button-leagueConfigurationSubmit"));

        // assert
        await waitFor(()=> {
            expect(fetchMock).toHaveBeenCalled();
            expect(fetchMock).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({"body": expect.stringContaining("\"leagueStatus\":\"archive\"")}));
            expect(queryByTestId("leagueConfiguration-form-submission-error")).not.toBeTruthy();
        });
    });

    it("should submit a request with a valid leagueKey from it's compoenent fields", async ()=> {
        // arrange
        const { getByTestId, queryByTestId } = render(<LeagueConfigurationForm/>);

        const wikiPageNameElm = getByTestId("test-input-wikiPageName");
        const wikiSectionHeaderElm = getByTestId("test-input-wikiSectionHeader");
        const showNameElm = getByTestId("test-select-showName");
        const showSeasonElm = getByTestId("test-input-showSeason");
        const contestantTypeElm = getByTestId("test-input-contestantType");
        const leagueStatusElm = getByTestId("test-select-leagueStatus");
        const googleSheetUrlElm = getByTestId("test-input-googleSheetUrl");

        fireEvent.change(wikiPageNameElm, {target: { value: testFormData.wikiPageName }});
        fireEvent.change(wikiSectionHeaderElm, {target: { value: testFormData.wikiSectionHeader }});
        fireEvent.change(showNameElm, {target: { value: testFormData.showName }});
        fireEvent.change(showSeasonElm, {target: { value: testFormData.showSeason }});
        fireEvent.change(contestantTypeElm, {target: { value: testFormData.contestantType }});
        fireEvent.change(leagueStatusElm, {target: { value: testFormData.leagueStatus }});
        fireEvent.change(googleSheetUrlElm, {target: { value: testFormData.googleSheetUrl }});

        const expectedLeagueKey = testFormData.showName + ":" + testFormData.showSeason;

        // act
        fireEvent.click(getByTestId("test-button-leagueConfigurationSubmit"));

        // assert
        await waitFor(()=> {
            expect(fetchMock).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({"body": expect.stringContaining(`"leagueKey":"${expectedLeagueKey}"`)}));
            expect(queryByTestId("leagueConfiguration-form-submission-error")).not.toBeTruthy();
        });
    });

    it("should have inline error where the input doesn't validate", async ()=> {
        const { getByTestId } = render(<LeagueConfigurationForm/>);

        // act
        let wikiPageNameElm = getByTestId("test-input-wikiPageName");
        fireEvent.change(wikiPageNameElm, {target: { value: "12#$ABC_+)(" }});

        // assert
        await waitFor(()=> {
            expect(getByTestId("test-label-wikiPageName-errorMsg")).toBeTruthy();
            expect(wikiPageNameElm).toBeInvalid();
        });
    });

    it("should validate with allowed special characters", async ()=> {
        const { queryByTestId, getByTestId } = render(<LeagueConfigurationForm/>);

        // act
        let wikiPageNameElm = getByTestId("test-input-wikiPageName");
        fireEvent.change(wikiPageNameElm, {target: { value: "abc123:ABC" }});

        // assert
        await waitFor(()=> {
            wikiPageNameElm = getByTestId("test-input-wikiPageName");
            expect(wikiPageNameElm).toBeValid();
            expect(queryByTestId("test-label-wikiPageName-errorMsg")).not.toBeTruthy();
        });

        fireEvent.change(wikiPageNameElm, {target: { value: "abc123:ABC:()_12309" }});

        await waitFor(()=> {
            wikiPageNameElm = getByTestId("test-input-wikiPageName");
            expect(wikiPageNameElm).toBeValid();
            expect(queryByTestId("test-label-wikiPageName-errorMsg")).not.toBeTruthy();
        });
    });
    
    it("should display error when form submission fails", async ()=> {
        // setup
        fetchMock = jest.spyOn(global, "fetch").mockImplementation(leagueConfigFetch401ErrorMock);
        const { getByTestId, getByText } = render(<LeagueConfigurationForm/>);
        const wikiPageNameElm = getByTestId("test-input-wikiPageName");
        const wikiSectionHeaderElm = getByTestId("test-input-wikiSectionHeader");
        const showNameElm = getByTestId("test-select-showName");
        const showSeasonElm = getByTestId("test-input-showSeason");
        const contestantTypeElm = getByTestId("test-input-contestantType");
        const leagueStatusElm = getByTestId("test-select-leagueStatus");
        const googleSheetUrlElm = getByTestId("test-input-googleSheetUrl");

        // act 
        fireEvent.change(wikiPageNameElm, {target: { value: testFormData.wikiPageName }});
        fireEvent.change(wikiSectionHeaderElm, {target: { value: testFormData.wikiSectionHeader }});
        fireEvent.change(showNameElm, {target: { value: testFormData.showName }});
        fireEvent.change(showSeasonElm, {target: { value: testFormData.showSeason }});
        fireEvent.change(contestantTypeElm, {target: { value: testFormData.contestantType }});
        fireEvent.change(leagueStatusElm, {target: { value: testFormData.leagueStatus }});
        fireEvent.change(googleSheetUrlElm, {target: { value: testFormData.googleSheetUrl }});
        fireEvent.click(getByTestId("test-button-leagueConfigurationSubmit"));
        
        // assert
        await waitFor(()=> {
            expect(fetchMock).toHaveBeenCalled();
            expect(getByTestId("leagueConfiguration-form-submission-error")).toBeTruthy();
            expect(getByText(UNAUTHENTICATED_ERROR_MESSAGE)).toBeTruthy();
        })
    })

    it("should prevent form submission if there are form input errors", async ()=> {
        // setup
        const { getByTestId } = render(<LeagueConfigurationForm/>);
        const wikiPageNameElm = getByTestId("test-input-wikiPageName");
        const wikiSectionHeaderElm = getByTestId("test-input-wikiSectionHeader");
        const showNameElm = getByTestId("test-select-showName");
        const showSeasonElm = getByTestId("test-input-showSeason");
        const contestantTypeElm = getByTestId("test-input-contestantType");
        const leagueStatusElm = getByTestId("test-select-leagueStatus");
        const googleSheetUrlElm = getByTestId("test-input-googleSheetUrl");
        const formBtn = getByTestId("test-button-leagueConfigurationSubmit");

        // act 
        fireEvent.change(wikiPageNameElm, {target: { value: testFormData.wikiPageName }});
        fireEvent.change(wikiSectionHeaderElm, {target: { value: testFormData.wikiSectionHeader }});
        fireEvent.change(showNameElm, {target: { value: testFormData.showName }});
        fireEvent.change(showSeasonElm, {target: { value: testFormData.showSeason }});
        // This is an invalid value for the contestant type
        fireEvent.change(contestantTypeElm, {target: { value: "2@$%$sdfsd" }});
        fireEvent.change(leagueStatusElm, {target: { value: testFormData.leagueStatus }});
        fireEvent.change(googleSheetUrlElm, {target: { value: "https://test.com" }});

        // assert
        await waitFor(()=> {
            expect(getByTestId("test-label-contestantType-errorMsg")).toBeTruthy();
            expect(formBtn.disabled).toBe(true);
        });
    })

    it("should prevent form submission if there are remaining form input errors after input correction", async ()=> {
        // setup
        const { getByTestId } = render(<LeagueConfigurationForm/>);
        const wikiPageNameElm = getByTestId("test-input-wikiPageName");
        const wikiSectionHeaderElm = getByTestId("test-input-wikiSectionHeader");
        const showNameElm = getByTestId("test-select-showName");
        const showSeasonElm = getByTestId("test-input-showSeason");
        const contestantTypeElm = getByTestId("test-input-contestantType");
        const leagueStatusElm = getByTestId("test-select-leagueStatus");
        const googleSheetUrlElm = getByTestId("test-input-googleSheetUrl");
        const formBtn = getByTestId("test-button-leagueConfigurationSubmit");

        // act
        fireEvent.change(wikiPageNameElm, {target: { value: "@*&6!3*&^!@GHJ" }});
        fireEvent.change(wikiSectionHeaderElm, {target: { value: testFormData.wikiSectionHeader }});
        fireEvent.change(showNameElm, {target: { value: testFormData.showName }});
        fireEvent.change(showSeasonElm, {target: { value: testFormData.showSeason }});
        // This is an invalid value for the contestant type
        fireEvent.change(contestantTypeElm, {target: { value: "2@$%$sdfsd" }});
        fireEvent.change(leagueStatusElm, {target: { value: testFormData.leagueStatus }});
        fireEvent.change(googleSheetUrlElm, {target: { value: "https://test.com" }});

        // assert
        await waitFor(()=> {
            expect(getByTestId("test-label-contestantType-errorMsg")).toBeTruthy();
            expect(formBtn.disabled).toBe(true);
        });

        // act
        fireEvent.change(contestantTypeElm, {target: { value: testFormData.contestantType }});

        // assert
        await waitFor(()=>{
            expect(document.querySelector("[data-testId='test-label-contestantType-errorMsg']")).toBe(null);
            expect(getByTestId("test-label-wikiPageName-errorMsg")).not.toBe(null);
            expect(formBtn.disabled).toBe(true);
        });

        // act
        fireEvent.change(wikiPageNameElm, {target: { value: testFormData.wikiPageName }});
       
        // assert
        await waitFor(()=> {
            expect(document.querySelector("[data-testId='test-label-contestantType-errorMsg']")).toBe(null);
            expect(document.querySelector("[data-testId='test-label-wikiPageName-errorMsg']")).toBe(null);
            expect(formBtn.disabled).toBe(false);
        });
    });
})

describe("LeagueConfigurationForm in edit mode", ()=> {
    let fetchMock = undefined;

    const storedLeague = {
        leagueId: "big_brother:28",
        urlSlug: "big-brother-28",
        wikiPageName: "Big_Brother_28_(American_season)",
        wikiSectionHeader: "HouseGuests",
        showName: "big_brother",
        showSeason: "28",
        contestantType: "Contestants",
        leagueStatus: "archive",
        googleSheetUrl: "https://docs.google.com/spreadsheets/d/testurl"
    };

    const leagueUpdateFetchSuccessMock = () => Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({ message: "updated" })
    });

    const leagueUpdateFetchErrorMock = (status) => () => Promise.resolve({
        ok: false,
        status,
        json: async () => {}
    });

    const submittedBody = () => JSON.parse(fetchMock.mock.calls.at(-1)[1].body);

    beforeEach(() => {
        mockRouterPush.mockClear();
        fetchMock = jest.spyOn(global, "fetch")
            .mockImplementation(leagueUpdateFetchSuccessMock);
        fetchMock.mockClear();
    });

    it("should pre-fill each field from the stored league", ()=> {
        const { getByTestId } = render(<LeagueConfigurationForm league={storedLeague}/>);

        // assert
        expect(getByTestId("test-input-wikiPageName")).toHaveValue(storedLeague.wikiPageName);
        expect(getByTestId("test-input-wikiSectionHeader")).toHaveValue(storedLeague.wikiSectionHeader);
        expect(getByTestId("test-select-showName")).toHaveValue(storedLeague.showName);
        expect(getByTestId("test-input-showSeason")).toHaveValue(storedLeague.showSeason);
        expect(getByTestId("test-input-contestantType")).toHaveValue(storedLeague.contestantType);
        expect(getByTestId("test-input-googleSheetUrl")).toHaveValue(storedLeague.googleSheetUrl);
    });

    it("should show a stored archive status as the archived option", ()=> {
        const { getByTestId } = render(<LeagueConfigurationForm league={storedLeague}/>);

        // assert
        expect(getByTestId("test-select-leagueStatus")).toHaveValue("archived");
    });

    it("should lock the show name and season", ()=> {
        const { getByTestId } = render(<LeagueConfigurationForm league={storedLeague}/>);

        // assert
        expect(getByTestId("test-select-showName")).toBeDisabled();
        expect(getByTestId("test-input-showSeason")).toBeDisabled();
    });

    it("should start with submit enabled when the stored values are valid", async ()=> {
        const { getByTestId } = render(<LeagueConfigurationForm league={storedLeague}/>);

        // assert
        await waitFor(()=> {
            expect(getByTestId("test-button-leagueConfigurationSubmit")).toBeEnabled();
        });
        expect(getByTestId("test-button-leagueConfigurationSubmit")).toHaveTextContent("Update League");
    });

    it("should show a stored value that no longer validates as an error and keep submit disabled", async ()=> {
        const { getByTestId } = render(<LeagueConfigurationForm league={{ ...storedLeague, wikiSectionHeader: "House Guests!" }}/>);

        // assert
        await waitFor(()=> {
            expect(getByTestId("test-label-wikiSectionHeader-errorMsg")).toBeTruthy();
            expect(getByTestId("test-button-leagueConfigurationSubmit")).toBeDisabled();
        });
    });

    it("should PUT to the url for the league id it was given", async ()=> {
        const { getByTestId } = render(<LeagueConfigurationForm league={storedLeague}/>);

        // act
        await waitFor(()=> expect(getByTestId("test-button-leagueConfigurationSubmit")).toBeEnabled());
        fireEvent.click(getByTestId("test-button-leagueConfigurationSubmit"));

        // assert
        await waitFor(()=> {
            expect(fetchMock).toHaveBeenCalledWith(
                "/api/league/big_brother%3A28",
                expect.objectContaining({ method: "PUT" }));
        });
    });

    it("should send only the editable fields, with archived turned back into archive", async ()=> {
        const { getByTestId } = render(<LeagueConfigurationForm league={storedLeague}/>);

        // act
        await waitFor(()=> expect(getByTestId("test-button-leagueConfigurationSubmit")).toBeEnabled());
        fireEvent.click(getByTestId("test-button-leagueConfigurationSubmit"));

        // assert
        await waitFor(()=> {
            expect(submittedBody()).toEqual({
                wikiPageName: storedLeague.wikiPageName,
                wikiSectionHeader: storedLeague.wikiSectionHeader,
                contestantType: storedLeague.contestantType,
                leagueStatus: "archive",
                googleSheetUrl: storedLeague.googleSheetUrl
            });
        });
    });

    it("should go to the league details page for the new status after saving", async ()=> {
        const { getByTestId } = render(<LeagueConfigurationForm league={storedLeague}/>);

        // act
        await waitFor(()=> expect(getByTestId("test-button-leagueConfigurationSubmit")).toBeEnabled());
        fireEvent.change(getByTestId("test-select-leagueStatus"), {target: { value: "active" }});
        fireEvent.click(getByTestId("test-button-leagueConfigurationSubmit"));

        // assert
        await waitFor(()=> {
            expect(mockRouterPush).toHaveBeenCalledWith("/active/big-brother-28/league-details");
        });
    });

    it.each([
        [401, UNAUTHENTICATED_ERROR_MESSAGE],
        [403, UNAUTHORIZED_ERROR_MESSAGE],
        [404, LEAGUE_NOT_FOUND_ERROR_MESSAGE],
        [500, GENERIC_FORM_ERROR_MESSAGE]
    ])("should show the right message when saving returns a %s", async (status, expectedMessage)=> {
        fetchMock = jest.spyOn(global, "fetch").mockImplementation(leagueUpdateFetchErrorMock(status));
        const { getByTestId, getByText } = render(<LeagueConfigurationForm league={storedLeague}/>);

        // act
        await waitFor(()=> expect(getByTestId("test-button-leagueConfigurationSubmit")).toBeEnabled());
        fireEvent.click(getByTestId("test-button-leagueConfigurationSubmit"));

        // assert
        await waitFor(()=> {
            expect(getByTestId("leagueConfiguration-form-submission-error")).toBeTruthy();
            expect(getByText(expectedMessage)).toBeTruthy();
        });
        expect(mockRouterPush).not.toHaveBeenCalled();
    });
});
