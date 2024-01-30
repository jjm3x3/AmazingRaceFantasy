import React from "react";
import { render } from "@testing-library/react";
import ContestantSelector from "../../app/components/contestantSelector";

const listOfContestantRoundListsMockData = [
  {
    key: "test",
    content: "test test",
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
