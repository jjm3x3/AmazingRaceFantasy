import { getNumberOfRounds } from "../../app/generators/contestantRoundListGenerator";

describe("getNumberOfRounds", () => {
  it("should not ever return Number.MAX_VALUE", () => {
    //Arrange
    const teamList = [
      { eliminationOrder: 1 },
      { eliminationOrder: 2 },
      { eliminationOrder: Number.MAX_VALUE },
    ];

    // Act
    const result = getNumberOfRounds(teamList);

    // Assert
    expect(result).not.toBe(Number.MAX_VALUE);
  });
});
