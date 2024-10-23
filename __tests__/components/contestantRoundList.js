import { render } from "@testing-library/react";
import ContestantRoundList from "../../app/components/contestantRoundList";
import Team from "../../app/models/Team";

const perfectScoreName = "*perfect*";
const mockContestantName = "Jacob";
const mockPerfectRoundScores = [
  {
    round: 0,
    contestantRoundData: [
      {
        name: perfectScoreName,
        roundScore: 1,
        totalScore: 1,
      },
    ],
  },
  {
    round: 1,
    contestantRoundData: [
      {
        name: perfectScoreName,
        roundScore: 2,
        totalScore: 3,
      },
    ],
  },
  {
    round: 2,
    contestantRoundData: [
      {
        name: perfectScoreName,
        roundScore: 3,
        totalScore: 6,
      },
    ],
  },
];
const mockContestantRoundScores = [
  {
    round: 0,
    contestantRoundData: [
      {
        name: mockContestantName,
        roundScore: 1,
        totalScore: 1,
      },
    ],
  },
  {
    round: 1,
    contestantRoundData: [
      {
        name: mockContestantName,
        roundScore: 2,
        totalScore: 3,
      },
    ],
  },
  {
    round: 2,
    contestantRoundData: [
      {
        name: mockContestantName,
        roundScore: 3,
        totalScore: 6,
      },
    ],
  },
];
const mockPerfectTeamList = [
  new Team({ teamName: "name1_1 & name1_2" }),
  new Team({ teamName: "name2_1 & name2_2" }),
  new Team({ teamName: "name3_1 & name3_2" }),
];
const mockContestantTeamList = [
  new Team({ teamName: "name1_1 & name1_2" }),
  new Team({ teamName: "name2_1 & name2_2" }),
  new Team({ teamName: "name3_1 & name3_2" }),
];

describe("ContestantRoundList", () => {
  it("should render", () => {
    render(
      <ContestantRoundList
        perfectRoundScores={mockPerfectRoundScores}
        contestantRoundScores={mockContestantRoundScores}
        perfectTeamList={mockPerfectTeamList}
        contestantTeamList={mockContestantTeamList}
        contestantName={mockContestantName}
      />,
    );
  });
});
