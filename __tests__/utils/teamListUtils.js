import { shouldBeScored, getRoundEliminationOrderMapping, getUniqueEliminationOrders } from "../../app/utils/teamListUtils";
import CompetingEntity from "@/app/models/CompetingEntity";

describe("teamListUtils shouldBeScored", () => {

    it.each([true, false]
    )("should be false when there is exactly one team and one elimination", (isInPlay) => {
        // Arrange
        const aTeam = {
            isInPlay: (_round) => isInPlay
        };
        const teamList = [aTeam];
        const eliminationOrder = 1;
        const numberOfEliminations = 1;

        // Act
        const result = shouldBeScored(teamList, aTeam, eliminationOrder, numberOfEliminations);

        // Assert
        expect(result).toBeFalsy();
    });

    it.each([true, false]
    )("should be false when the target team is at the end of array and there is one elimination", (isInPlay) => {
        // Note: being at the end of the array assumes that that team should be
        //   eliminated first
        // Note2: rounds are 0 indexed so the first round is 0

        // Arrange
        const aTeam = {
            isInPlay: (_round) => isInPlay
        };
        const teamList = [{}, aTeam];
        const eliminationOrder = 1;
        const numberOfEliminations = 1;

        // Act
        const result = shouldBeScored(teamList, aTeam, eliminationOrder, numberOfEliminations);

        // Assert
        expect(result).toBeFalsy();
    });

    it.each([true, false]
    )("should be false when the target team is at the end of array and there are two eliminations", (isInPlay) => {

        // Arrange
        const aTeam = {
            isInPlay: (_round) => isInPlay
        };
        const teamList = [{}, aTeam];
        const eliminationOrder = 2;
        const numberOfEliminations = 2;

        // Act
        const result = shouldBeScored(teamList, aTeam, eliminationOrder, numberOfEliminations);

        // Assert
        expect(result).toBeFalsy();
    });

    it("should be false when the target team is in the 2nd position or second from the end of array and there are two eliminations", () => {

        // Arrange
        const aTeam = {
            isInPlay: (_round) => true
        };
        const teamList = [aTeam, {}];
        const eliminationOrder = 1; // doesn't really matter because we are mocking isInPlay
        const numberOfEliminations = 2;

        // Act
        const result = shouldBeScored(teamList, aTeam, eliminationOrder, numberOfEliminations);

        // Assert
        expect(result).toBeFalsy();
    });

    it("should be true when the target team is in the 2nd position or second from the end of array and there is only one elimination", () => {
        // Arrange
        const aTeam = {
            isInPlay: (_round) => true
        };
        const teamList = [aTeam, {}];
        const eliminationOrder = 1;
        const numberOfEliminations = 1;

        // Act
        const result = shouldBeScored(teamList, aTeam, eliminationOrder, numberOfEliminations);

        // Assert
        expect(result).toBeTruthy();
    });

    it.each([1,3]
    )("Should call team.isInPlay with the eliminationOrder passed in", (elimOrder) => {
        // Arrange
        const aTeam = {
            isInPlay: jest.fn(),
        };
        const teamList = [aTeam, { eliminationOrder: 1 }, { eliminationOrder: 1 }];
        const eliminationOrder = elimOrder;
        const numberOfEliminations = 3; // doesn't matter much, just is inline with expected state

        // Act
        shouldBeScored(teamList, aTeam, eliminationOrder, numberOfEliminations);

        // Assert
        expect(aTeam.isInPlay).toHaveBeenCalledWith(eliminationOrder);
    });
});

describe("getRoundEliminationOrderMapping", () => {

    it("Should be able to produce a mapping which includes round 0", () => {

        // Arrange
        let exampleTeam = new CompetingEntity({teamName: "name1_1 & name1_2", isParticipating: true, eliminationOrder: 0});
        let exampleTeam2 = new CompetingEntity({teamName: "name2_1 & name2_2", isParticipating: true, eliminationOrder: 0});
        let exampleTeam3 = new CompetingEntity({teamName: "name3_1 & name3_2", isParticipating: false, eliminationOrder: 1});

        const teamList = [exampleTeam, exampleTeam2, exampleTeam3];

        // Act
        const mapping = getRoundEliminationOrderMapping(teamList);

        // Assert
        expect(mapping[0]).toBe(1);
    });

    it("Should be able to determine the find the appropriate eliminationOrder after a multi elimination round", () => {

        // Arrange
        let exampleTeam = new CompetingEntity({teamName: "name1_1 & name1_2", isParticipating: true, eliminationOrder: 3});
        let exampleTeam2 = new CompetingEntity({teamName: "name2_1 & name2_2", isParticipating: true, eliminationOrder: 1});
        let exampleTeam3 = new CompetingEntity({teamName: "name3_1 & name3_2", isParticipating: false, eliminationOrder: 1});

        const teamList = [exampleTeam, exampleTeam2, exampleTeam3];

        // Act
        const mapping = getRoundEliminationOrderMapping(teamList);

        // Assert
        expect(mapping[1]).toBe(3);
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
