import { shouldBeScored, getUniqueEliminationOrders } from "../../app/utils/teamListUtils";

describe("teamListUtils shouldBeScored", () => {
    it("should be false when there is exactly one team and we are on the first round", () => {
        // Arrange
        const aTeam = {
            isInPlay: (_round) => true
        };
        const teamList = [aTeam];
        const roundNumber = 0;

        // Act
        const result = shouldBeScored(teamList, aTeam, roundNumber);

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
        const roundNumber = 0;

        // Act
        const result = shouldBeScored(teamList, aTeam, roundNumber);

        // Assert
        expect(result).toBeFalsy();
    });

    it("should be false when the target team is at the end of array and its the second round round", () => {

        // Arrange
        const aTeam = {
            isInPlay: (_round) => true
        };
        const teamList = [{}, aTeam];
        const roundNumber = 1;

        // Act
        const result = shouldBeScored(teamList, aTeam, roundNumber);

        // Assert
        expect(result).toBeFalsy();
    });

    it("should be true when the target team is in the 2nd position or second from the end of array and its the first round", () => {
        // Arrange
        const aTeam = {
            isInPlay: (_round) => true
        };
        const teamList = [aTeam, {}];
        const roundNumber = 0;

        // Act
        const result = shouldBeScored(teamList, aTeam, roundNumber);

        // Assert
        expect(result).toBeTruthy();
    });

    it("Should be able to determine the round even with eliminationOrder being 1 indexed", () => {
        // Arrange
        const aTeam = {
            isInPlay: jest.fn(),
        };
        const teamList = [aTeam, {}];
        const roundNumber = 0;

        // Act
        shouldBeScored(teamList, aTeam, roundNumber, 1); // the last argument is now just the current elimOrder

        // Assert
        expect(aTeam.isInPlay).toHaveBeenCalledWith(1);
    });

    it("Should be able to determine the find the appropriate eliminationOrder after a multi elimination round", () => {
        // Arrange
        const aTeam = {
            isInPlay: jest.fn(),
        };
        const teamList = [aTeam, { eliminationOrder: 1 }, { eliminationOrder: 1 }];
        const roundNumber = 1;

        // Act
        shouldBeScored(teamList, aTeam, roundNumber, 3); // the last argument is now just the current elimOrder

        // Assert
        expect(aTeam.isInPlay).toHaveBeenCalledWith(3);
    });
});

describe("getUniqueEliminationOrders", () => {
    it("Should include even teams with partial eliminationOrders", () => {
        // Arrange
        const partialEliminationOrder = 12.5;
        const aTeam = {
            isInPlay: jest.fn(),
            eliminationOrder: partialEliminationOrder
        };
        const teamList = [aTeam, { eliminationOrder: 1 }, { eliminationOrder: 1 }];

        // Act
        const result = getUniqueEliminationOrders(teamList);

        // Assert
        expect(result).toContain(partialEliminationOrder);
    });
});
