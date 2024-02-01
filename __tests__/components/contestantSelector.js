import { render, screen } from "@testing-library/react";
import ContestantSelector from "../../app/components/contestantSelector";
import ContestantRoundList from "../../app/components/contestantRoundList";
import Team from "../../app/models/Team";

const listOfContestantRoundListsMockData = [
  {
    key: "Jacob",
    content: (
      <ContestantRoundList
        perfectRoundScores={[1, 2, 3]}
        contestantRoundScores={[1, 2, 3]}
        perfectTeamList={[
          new Team({ teamName: "name1_1 & name1_2" }),
          new Team({ teamName: "name2_1 & name2_2" }),
          new Team({ teamName: "name3_1 & name3_2" }),
        ]}
        contestantTeamList={[
          new Team({ teamName: "name1_1 & name1_2" }),
          new Team({ teamName: "name2_1 & name2_2" }),
          new Team({ teamName: "name3_1 & name3_2" }),
        ]}
      />
    ),
  },
];

describe("ContestantSelector", () => {
  it("should render with default content", () => {
    render(
      <ContestantSelector
        listOfContestantRoundLists={listOfContestantRoundListsMockData}
      />
    );
    expect(screen.getByTestId("jacob-contestant").textContent).toEqual("Jacob");
    expect(screen.getByTestId("contestants-selector").value).toEqual("Jacob");
  });
});
