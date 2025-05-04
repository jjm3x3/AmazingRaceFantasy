import { render } from "@testing-library/react";
import ContestantSelector from "../../app/components/contestantSelector";
import ContestantRoundList from "../../app/components/contestantRoundList";
import CompetingEntity from "@/app/models/CompetingEntity";

const perfectScoreName = "*perfect*";
const mockContestantName = "Jacob";
const listOfContestantRoundListsMockData = [
    {
        key: mockContestantName,
        content: (
            <ContestantRoundList
                perfectRoundScores={[
                    {
                        round: 0,
                        contestantRoundData: [{
                            name: perfectScoreName,
                            roundScore: 1,
                            totalScore: 1
                        }]
                    },
                    {
                        round: 1,
                        contestantRoundData: [{
                            name: perfectScoreName,
                            roundScore: 2,
                            totalScore: 3
                        }]
                    },
                    {
                        round: 2,
                        contestantRoundData: [{
                            name: perfectScoreName,
                            roundScore: 3,
                            totalScore: 6
                        }]
                    },
                ]}
                contestantRoundScores={[
                    {
                        round: 0,
                        contestantRoundData: [{
                            name: mockContestantName,
                            roundScore: 1,
                            totalScore: 1
                        }]
                    },
                    {
                        round: 1,
                        contestantRoundData: [{
                            name: mockContestantName,
                            roundScore: 2,
                            totalScore: 3
                        }]
                    },
                    {
                        round: 2,
                        contestantRoundData: [{
                            name: mockContestantName,
                            roundScore: 3,
                            totalScore: 6
                        }]
                    },
                ]}
                perfectTeamList={[
                    new CompetingEntity({ teamName: "name1_1 & name1_2" }),
                    new CompetingEntity({ teamName: "name2_1 & name2_2" }),
                    new CompetingEntity({ teamName: "name3_1 & name3_2" }),
                ]}
                contestantTeamList={[
                    new CompetingEntity({ teamName: "name1_1 & name1_2" }),
                    new CompetingEntity({ teamName: "name2_1 & name2_2" }),
                    new CompetingEntity({ teamName: "name3_1 & name3_2" }),
                ]}
                contestantName={mockContestantName}
            />
        ),
    },
];

describe("ContestantSelector", () => {
    it("should render with default content", () => {
        const { getByTestId } = render(
            <ContestantSelector
                listOfContestantRoundLists={listOfContestantRoundListsMockData}
            />
        );
        expect(getByTestId("optionJacob").textContent).toEqual("Jacob");
        expect(getByTestId("contestants-selector").value).toEqual("Jacob");
    });
});
