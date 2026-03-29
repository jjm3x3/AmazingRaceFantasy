import TeamListWithToggle from "@/app/[showStatus]/[showNameAndSeason]/contestants/teamListWithToggle";
import { render, fireEvent, waitFor } from "@testing-library/react";

const playerData = [{
    key: "user1",
    value: "user1",
    id: "user1",
    text: "User One",
    teamList: [
        "Contestant 1",
        "Contestant 2",
        "Contestant 3"
    ]
}, {
    key: "user2",
    value: "user2",
    id: "user2",
    text: "User Two",
    teamList: [
        "Contestant 2",
        "Contestant 3",
        "Contestant 1"
    ]
}, {
    key: "user3",
    value: "user3",
    id: "user3",
    text: "User Three",
    teamList: [
        "Contestant 3",
        "Contestant 1",
        "Contestant 2"
    ]
}];



describe("ContestantsPageContent Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render the correct number of contestants", () => {
        // setup
        const mockContestantsData = [
            { teamName: "Contestant 1" },
            { teamName: "Contestant 2" },
            { teamName: "Contestant 3" }
        ];

        const { getByText } = render(<TeamListWithToggle playerData={playerData} contestantsData={mockContestantsData}/>);

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

        const { getByText, getByTestId } = render(<TeamListWithToggle playerData={playerData} contestantsData={mockContestantsData}/>);
        
        let contestant1Elm = getByText("Contestant 1");
        let contestant2Elm = getByText("Contestant 2");
        let contestant3Elm = getByText("Contestant 3");

        // assert
        expect(contestant1Elm.tagName).toBe("P");
        expect(contestant2Elm.tagName).toBe("P");
        expect(contestant3Elm.tagName).toBe("P");

        const toggleBtn = getByTestId("test-checkboxToggle-contestant-elimination-status-toggle");
        fireEvent.click(toggleBtn);
        waitFor(() => {
            contestant1Elm = getByText("Contestant 1");
            contestant2Elm = getByText("Contestant 2");
            contestant3Elm = getByText("Contestant 3");
    
            expect(contestant1Elm.tagName).toBe("P");
            expect(contestant2Elm.tagName).toBe("S");
            expect(contestant3Elm.tagName).toBe("P");
        });

    });

    it("should update the list with the selected contestant", () => {
        // setup
        const mockContestantsData = [
            { teamName: "Contestant 1", isParticipating: true },
            { teamName: "Contestant 2", isParticipating: false },
            { teamName: "Contestant 3", isParticipating: true }
        ];

        const { getByTestId } = render(<TeamListWithToggle playerData={playerData} contestantsData={mockContestantsData}/>);
        const selectEl = getByTestId("test-select-player-selector");
        let contestantsList = getByTestId("team-list-container");
        let firstListElem = contestantsList.firstElementChild.firstElementChild;

        // assert
        expect(firstListElem).toBeTruthy();
        expect(firstListElem.textContent).toBe("Contestant 1");
        expect(firstListElem.nextElementSibling.textContent).toBe("Contestant 2");
        expect(firstListElem.nextElementSibling.nextElementSibling?.textContent).toBe("Contestant 3");

        fireEvent.change(selectEl, { target: { value: "user2" } });
        contestantsList = getByTestId("team-list-container");
        firstListElem = contestantsList.firstElementChild.firstElementChild;

        waitFor(() => {
            expect(firstListElem.textContent).toBe("Contestant 2");
            expect(firstListElem.nextElementSibling.textContent).toBe("Contestant 3");
            expect(firstListElem.nextElementSibling.nextElementSibling?.textContent).toBe("Contestant 1");
        });
    });
});