import { shouldBeScored, getNumberOfRounds } from "../../app/utils/teamListUtils";

describe("teamListUtils shouldBeScored", () => {
    it("should be false when there is exactly one team and we are on the first round", () => {
        // Arrange
        const aTeam = {
            isInPlay: (round) => true
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
            isInPlay: (round) => true
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
            isInPlay: (round) => true
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
            isInPlay: (round) => true
        };
        const teamList = [aTeam, {}];

        // Act
        const result = shouldBeScored(teamList, aTeam, 0);

        // Assert
        expect(result).toBeTruthy();
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
});
