import React from "react";
import { render } from "@testing-library/react";
import ContestantSelector from "../../app/components/contestantSelector";
import ContestantRoundList from "../../app/components/contestantRoundList";

const listOfContestantRoundListsMockData = [
  {
    key: "Jacob",
    content: (
      <ContestantRoundList
        perfectRoundScores={[]}
        contestantRoundScores={[]}
        perfectTeamList={[]}
        contestantTeamList={[]}
      />
    ),
  },
];

describe("ContestantSelector", () => {
  it("should render with default content", () => {
    const { getByText } = render(
      <ContestantSelector
        listOfContestantRoundLists={listOfContestantRoundListsMockData}
      />
    );
  });
});
