import React from "react";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
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
  afterEach(() => {
    cleanup();
  });
  it("should render with default content", async () => {
    render(
      <ContestantSelector
        listOfContestantRoundLists={listOfContestantRoundListsMockData}
      />
    );
    const jacobContestantOption = await screen.getByTestId("jacob-contestant");
    const contestantSelectorElm = await screen.getByTestId(
      "contestants-selector"
    );
    await waitFor(() => {
      expect(jacobContestantOption.textContent).toEqual("Jacob");
      expect(contestantSelectorElm.value).toEqual("Jacob");
    });
  });
});
