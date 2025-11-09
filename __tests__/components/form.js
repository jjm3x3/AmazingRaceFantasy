import { render, fireEvent, waitFor } from "@testing-library/react";
import LeagueConfigurationForm from "@/app/league/configuration/form/form.tsx";

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
    leagueKey: "test",
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
    json: async () => {}
});

const leagueConfigFetch401ErrorMock = () => Promise.resolve({
    ok: true,
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
        const leagueKeyElm = getByTestId("test-input-leagueKey");
        fireEvent.change(leagueKeyElm, {target: { value: testFormData.leagueKey }});
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

    it("should submit a request with a valid status enum", ()=> {
        // arrange
        const { getByTestId, queryByTestId } = render(<LeagueConfigurationForm/>);

        const leagueStatusElm = getByTestId("test-select-leagueStatus");
        fireEvent.change(leagueStatusElm, {target: { value: "archived" }});

        // act
        fireEvent.click(getByTestId("test-button-leagueConfigurationSubmit"));

        // assert
        expect(fetchMock).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({"body": expect.stringContaining("\"leagueStatus\":\"archive\"")}));
        expect(queryByTestId("leagueConfiguration-form-submission-error")).not.toBeTruthy();
    });

    it("should have inline error where the input doesn't validate", ()=> {
        const { getByTestId } = render(<LeagueConfigurationForm/>);

        // act
        const wikiPageNameElm = getByTestId("test-input-wikiPageName");
        fireEvent.change(wikiPageNameElm, {target: { value: "12#$ABC_+)(" }});

        // assert
        expect(getByTestId("test-label-wikiPageName-errorMsg")).toBeTruthy();
        expect(wikiPageNameElm).toBeInvalid();
    });
    
    it("should display error when form submission fails", ()=> {
        // act 
        fetchMock = jest.spyOn(global, "fetch")
            .mockImplementation(leagueConfigFetch401ErrorMock);
        const { getByTestId } = render(<LeagueConfigurationForm/>);
        const wikiPageNameElm = getByTestId("test-input-wikiPageName");
        fireEvent.change(wikiPageNameElm, {target: { value: testFormData.wikiPageName }});
        const wikiSectionHeaderElm = getByTestId("test-input-wikiSectionHeader");
        fireEvent.change(wikiSectionHeaderElm, {target: { value: testFormData.wikiSectionHeader }});
        const leagueKeyElm = getByTestId("test-input-leagueKey");
        fireEvent.change(leagueKeyElm, {target: { value: testFormData.leagueKey }});
        const contestantTypeElm = getByTestId("test-input-contestantType");
        fireEvent.change(contestantTypeElm, {target: { value: testFormData.contestantType }});
        const leagueStatusElm = getByTestId("test-select-leagueStatus");
        fireEvent.change(leagueStatusElm, {target: { value: testFormData.leagueStatus }});
        const googleSheetUrlElm = getByTestId("test-input-googleSheetUrl");
        fireEvent.change(googleSheetUrlElm, {target: { value: testFormData.googleSheetUrl }});
        fireEvent.click(getByTestId("test-button-leagueConfigurationSubmit"));

        // assert
        waitFor(()=> {
            expect(getByTestId("leagueConfiguration-form-submission-error")).toBeTruthy();
        })
    })

    it("should prevent form submission if there are form input errors", ()=> {
        // act 
        const { getByTestId } = render(<LeagueConfigurationForm/>);
        const wikiPageNameElm = getByTestId("test-input-wikiPageName");
        fireEvent.change(wikiPageNameElm, {target: { value: testFormData.wikiPageName }});
        const wikiSectionHeaderElm = getByTestId("test-input-wikiSectionHeader");
        fireEvent.change(wikiSectionHeaderElm, {target: { value: testFormData.wikiSectionHeader }});
        const leagueKeyElm = getByTestId("test-input-leagueKey");
        fireEvent.change(leagueKeyElm, {target: { value: testFormData.leagueKey }});
        const contestantTypeElm = getByTestId("test-input-contestantType");
        // This is an invalid value for the contestant type
        fireEvent.change(contestantTypeElm, {target: { value: "2@$%$sdfsd" }});
        const leagueStatusElm = getByTestId("test-select-leagueStatus");
        fireEvent.change(leagueStatusElm, {target: { value: testFormData.leagueStatus }});
        const googleSheetUrlElm = getByTestId("test-input-googleSheetUrl");
        fireEvent.change(googleSheetUrlElm, {target: { value: "https://test.com" }});

        // assert
        waitFor(()=> {
            expect(getByTestId("test-label-contestantType-errorMsg")).toBeTruthy();
            const formBtn = getByTestId("test-button-leagueConfigurationSubmit");
            expect(formBtn.disabled).toBe(true);
        })
    })

    it("should prevent form submission if there are remaining form input errors after input correction", ()=> {
        // act 
        const { getByTestId } = render(<LeagueConfigurationForm/>);
        const wikiPageNameElm = getByTestId("test-input-wikiPageName");
        fireEvent.change(wikiPageNameElm, {target: { value: testFormData.wikiPageName }});
        const wikiSectionHeaderElm = getByTestId("test-input-wikiSectionHeader");
        fireEvent.change(wikiSectionHeaderElm, {target: { value: testFormData.wikiSectionHeader }});
        const leagueKeyElm = getByTestId("test-input-leagueKey");
        fireEvent.change(leagueKeyElm, {target: { value: "@*&6!3*&^!@GHJ" }});
        const contestantTypeElm = getByTestId("test-input-contestantType");
        // This is an invalid value for the contestant type
        fireEvent.change(contestantTypeElm, {target: { value: "2@$%$sdfsd" }});
        const leagueStatusElm = getByTestId("test-select-leagueStatus");
        fireEvent.change(leagueStatusElm, {target: { value: testFormData.leagueStatus }});
        const googleSheetUrlElm = getByTestId("test-input-googleSheetUrl");
        fireEvent.change(googleSheetUrlElm, {target: { value: "https://test.com" }});

        // assert
        waitFor(()=> {
            expect(getByTestId("test-label-contestantType-errorMsg")).toBeTruthy();
            const formBtn = getByTestId("test-button-leagueConfigurationSubmit");
            expect(formBtn.disabled).toBe(true);
        });

        fireEvent.change(contestantTypeElm, {target: { value: testFormData.contestantType }});
       
        waitFor(()=> {
            expect(getByTestId("test-label-contestantType-errorMsg")).toBeFalsy();
            expect(getByTestId("test-label-leagueKey-errorMsg")).toBeTruthy();
            const formBtn = getByTestId("test-button-leagueConfigurationSubmit");
            expect(formBtn.disabled).toBe(false);
        });

        fireEvent.change(contestantTypeElm, {target: { value: testFormData.contestantType }});
       
        waitFor(()=> {
            expect(getByTestId("test-label-contestantType-errorMsg")).toBeFalsy();
            expect(getByTestId("test-label-leagueKey-errorMsg")).toBeFalse();
            const formBtn = getByTestId("test-button-leagueConfigurationSubmit");
            expect(formBtn.disabled).toBe(true);
        });

    })
})
