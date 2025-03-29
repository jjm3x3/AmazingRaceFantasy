import { shouldBeScored, getUniqueEliminationOrders, getNumberOfRounds } from "../../app/utils/teamListUtils";

describe("teamListUtils shouldBeScored", () => {
    it("should be false when there is exactly one team and we are on the first round", () => {
        // Arrange
        const aTeam = {
            isInPlay: (_round) => true
        };
        const teamList = [aTeam];

        // Act
        const result = shouldBeScored(teamList, aTeam, 0);

        // Assert
        expect(result).toBeFalsy();
    });

    it("should be false when the target team is at the end of array and its the first round", () => {
        // Note: being at the end of the array assums that that team should he
        //   eliminated first
        // Note2: rounds are 0 indexed so the first round is 0

        // Arrange
        const aTeam = {
            isInPlay: (_round) => true
        };
        const teamList = [{}, aTeam];

        // Act
        const result = shouldBeScored(teamList, aTeam, 0);

        // Assert
        expect(result).toBeFalsy();
    });

    it("should be false when the target team is at the end of array and its the second round round", () => {

        // Arrange
        const aTeam = {
            isInPlay: (_round) => true
        };
        const teamList = [{}, aTeam];

        // Act
        const result = shouldBeScored(teamList, aTeam, 1);

        // Assert
        expect(result).toBeFalsy();
    });

    it("should be true when the target team is in the 2nd position or second from the end of array and its the first round", () => {
        // Arrange
        const aTeam = {
            isInPlay: (_round) => true
        };
        const teamList = [aTeam, {}];

        // Act
        const result = shouldBeScored(teamList, aTeam, 0);

        // Assert
        expect(result).toBeTruthy();
    });

    it("Should be able to determine the round even with eliminationOrder being 1 indexed", () => {
        // Arrange
        const aTeam = {
            isInPlay: jest.fn(),
            eliminationOrder: 1
        };
        const teamList = [aTeam, {}];

        // Act
        shouldBeScored(teamList, aTeam, 0);

        // Assert
        expect(aTeam.isInPlay).toHaveBeenCalledWith(1);
    });

    it("Should be able to determine the find the appropriate eliminationOrder after a multi elimination round", () => {
        // Arrange
        const aTeam = {
            isInPlay: jest.fn(),
            eliminationOrder: 3
        };
        const teamList = [aTeam, { eliminationOrder: 1 }, { eliminationOrder: 1 }];

        // Act
        shouldBeScored(teamList, aTeam, 1); // this is round 2, by 0 indexing

        // Assert
        expect(aTeam.isInPlay).toHaveBeenCalledWith(3);
    });
});

describe("getUniqueEliminationOrders", () => {
    it("Should include even teams with partial eliminationOrders", () => {
    });
});

describe("getNumberOfRounds", () => {
    it("should not ever return Number.MAX_VALUE", () => {
        //Arrange
        const teamList = [{eliminationOrder: 1}, {eliminationOrder:2}, {eliminationOrder: Number.MAX_VALUE}];

        // Act
        const result = getNumberOfRounds(teamList);

        // Assert
        expect(result).not.toBe(Number.MAX_VALUE);
    });

    it("Should return the number of unique eliminationOrders", () => {
        //Arrange
        const teamList = [
            {eliminationOrder: 1},
            {eliminationOrder: 1},
            {eliminationOrder: 3},
        ];

        // Act
        const result = getNumberOfRounds(teamList);

        // Assert
        expect(result).toBe(2);
    });

    it("Should not countin Number.MAX_VALUE as a unique number", () => {
        //Arrange
        const teamList = [
            {eliminationOrder: 1},
            {eliminationOrder: 3},
            {eliminationOrder: Number.MAX_VALUE}
        ];

        // Act
        const result = getNumberOfRounds(teamList);

        // Assert
        expect(result).toBe(2);
    });

    it("Should not countin 0 as a unique number", () => {
        //Arrange
        const teamList = [
            {eliminationOrder: 1},
            {eliminationOrder: 3},
            {eliminationOrder: 0}
        ];

        // Act
        const result = getNumberOfRounds(teamList);

        // Assert
        expect(result).toBe(2);
    });
});
