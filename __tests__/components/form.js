import { render, fireEvent, waitFor } from "@testing-library/react";
import LeagueConfigurationForm from "@/app/league/configuration/form/form.tsx";
import { UNAUTHENTICATED_ERROR_MESSAGE } from "@/app/dataSources/errorMsgs";

jest.mock("next/navigation", () => ({
    useRouter() {
        return {
            prefetch: () => null
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
        const leagueKeyElm = getByTestId("test-input-leagueKey");
        const showNameElm = getByTestId("test-select-showName");
        const showSeasonElm = getByTestId("test-input-showSeason");
        const contestantTypeElm = getByTestId("test-input-contestantType");
        const leagueStatusElm = getByTestId("test-select-leagueStatus");
        const googleSheetUrlElm = getByTestId("test-input-googleSheetUrl");
        
        fireEvent.change(wikiPageNameElm, {target: { value: testFormData.wikiPageName }});
        fireEvent.change(wikiSectionHeaderElm, {target: { value: testFormData.wikiSectionHeader }});
        fireEvent.change(leagueKeyElm, {target: { value: testFormData.leagueKey }});
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

        const showNameElm = getByTestId("test-select-showName");
        fireEvent.change(showNameElm, {target: { value: testFormData.showName }});
        const showSeasonElm = getByTestId("test-input-showSeason");
        fireEvent.change(showSeasonElm, {target: { value: testFormData.showSeason }});
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
        const wikiPageNameElm = getByTestId("test-input-wikiPageName");
        fireEvent.change(wikiPageNameElm, {target: { value: "12#$ABC_+)(" }});

        // assert
        await waitFor(()=> {
            expect(getByTestId("test-label-wikiPageName-errorMsg")).toBeTruthy();
            expect(wikiPageNameElm).toBeInvalid();
        })
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
