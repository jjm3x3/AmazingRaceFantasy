import ContestantsPageContent from "@/app/[showStatus]/[showNameAndSeason]/contestants/contestantsPageContent";
import { render, fireEvent } from "@testing-library/react";



describe("ContestantsPageContent Component", () => {
    it("should render the correct number of contestants", () => {
        // setup
        const mockContestantsData = [
            { teamName: "Contestant 1" },
            { teamName: "Contestant 2" },
            { teamName: "Contestant 3" }
        ];

        const { getByText } = render(<ContestantsPageContent contestantsData={mockContestantsData}/>);

        // assert
        expect(getByText("Contestant 1")).toBeTruthy();
        expect(getByText("Contestant 2")).toBeTruthy();
        expect(getByText("Contestant 3")).toBeTruthy();
    });

    it("should toggle the elimination status", () => {
        // setup
        const mockContestantsData = [
            { teamName: "Contestant 1", isParticipating: true },
            { teamName: "Contestant 2", isParticipating: false },
            { teamName: "Contestant 3", isParticipating: true }
        ];

        const { getByText, getByTestId } = render(<ContestantsPageContent contestantsData={mockContestantsData}/>);
        
        const contestant1Elm = getByText("Contestant 1");
        let contestant2Elm = getByText("Contestant 2");
        const contestant3Elm = getByText("Contestant 3");

        // assert
        expect(contestant1Elm.tagName).toBe("P");
        expect(contestant2Elm.tagName).toBe("P");
        expect(contestant3Elm.tagName).toBe("P");

        const toggleBtn = getByTestId("test-checkboxToggle-contestant-elimination-status-toggle");
        fireEvent.click(toggleBtn);
        contestant2Elm = getByText("Contestant 2");

        expect(contestant1Elm.tagName).toBe("P");
        expect(contestant2Elm.tagName).toBe("S");
        expect(contestant3Elm.tagName).toBe("P");

    });
});