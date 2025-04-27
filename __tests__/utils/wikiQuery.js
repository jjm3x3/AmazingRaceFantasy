import { getTeamList, isPartialContestantData, getCompetingEntityList, stripTableHeader } from "../../app/utils/wikiQuery";

describe("getTeamList", () => {
    it("should run", () => {
        // Arrange
        const firstContestantsFirstName = "Some";
        const secondContestantsFirstName = "SomeGuys";

        const listOfContestants = [
            {
                name: firstContestantsFirstName + " Guy",
                col4: "Participating"
            },
            {
                name: secondContestantsFirstName + " Brother",
                col4: "Participating"
            }];

        // Act
        var result = getTeamList(listOfContestants);

        // Assert
        expect(result).not.toBeNull();
    });

    it("should return two teams that have isParticipating false when only the first contestant/team has a status and the second team is not participating", () => {
        // Arrange
        const firstContestantsFirstName = "Some";
        const secondContestantsFirstName = "SomeGuys";

        const listOfContestants = [
            {
                name: firstContestantsFirstName + " Guy",
                col4: "Eliminated 1st & 2nd"
            },
            {
                name: secondContestantsFirstName + " Brother",
                col4: ""
            },
            {
                name: "3rdContestantSecondTeam" + " Guy",
                col4: ""
            },
            {
                name: "4thContestantSecondTeam" + " Brother",
                col4: ""
            }
        ];

        // Act
        var result = getTeamList(listOfContestants);

        // Assert
        expect(result).not.toBeNull();
        expect(result.length).toEqual(2);
        expect(result[0].isParticipating).toBeFalsy()
        expect(result[1].isParticipating).toBeFalsy()
    });

    it("Should parse out elimination order and populate it when the team is not participating", () => {
        const firstContestantsFirstName = "Some";
        const secondContestantsFirstName = "SomeGuys";
        const expectedEliminationOrder = 2;

        const listOfContestants = [
            {
                name: firstContestantsFirstName + " Guy",
                col4: "Eliminated " + expectedEliminationOrder + "nd"
            },
            {
                name: secondContestantsFirstName + " Brother",
                col4: "Eliminated " + expectedEliminationOrder + "nd"
            }
        ];

        var result = getTeamList(listOfContestants);

        expect(result[0].eliminationOrder).toEqual(2);
    });

    it("Should parse out elimination order when a team is third", () => {
        const firstContestantsFirstName = "Some";
        const secondContestantsFirstName = "SomeGuys";
        const expectedEliminationOrder = 2;

        const listOfContestants = [
            {
                name: "blah Guy",
                col4: "Participating"
            },
            {
                name: "meh Brother",
                col4: "Participating"
            },
            {
                name: "another guy",
                col4: "Participating"
            },
            {
                name: "his Brother",
                col4: "Participating"
            },
            {
                name: "third guy",
                col4: "Participating"
            },
            {
                name: "thrids Brother",
                col4: "Participating"
            },
            {
                name: firstContestantsFirstName + " Guy",
                col4: "third"
            },
            {
                name: secondContestantsFirstName + " Brother",
                col4: "third"
            }
        ];

        var result = getTeamList(listOfContestants);

        expect(result[3].eliminationOrder).toEqual(expectedEliminationOrder);
    });

    it("Should parse out elimination order when a team is runners-up", () => {
        const firstContestantsFirstName = "Some";
        const secondContestantsFirstName = "SomeGuys";
        const expectedEliminationOrder = 3;

        const listOfContestants = [
            {
                name: "blah Guy",
                col4: "Participating"
            },
            {
                name: "meh Brother",
                col4: "Participating"
            },
            {
                name: "another guy",
                col4: "Participating"
            },
            {
                name: "his Brother",
                col4: "Participating"
            },
            {
                name: "third guy",
                col4: "Participating"
            },
            {
                name: "thrids Brother",
                col4: "Participating"
            },
            {
                name: firstContestantsFirstName + " Guy",
                col4: "runners-up"
            },
            {
                name: secondContestantsFirstName + " Brother",
                col4: "runners-up"
            }
        ];

        var result = getTeamList(listOfContestants);

        expect(result[3].eliminationOrder).toEqual(expectedEliminationOrder);
    });

    it("should create team names based on merging contestants full names two at a time", () => {
        // Arrange
        const firstContestantsFullName = "Some" + " Guy";
        const secondContestantsFullName = "SomeGuys" + " Brother";
        const expectedTeamName = firstContestantsFullName + " & " + secondContestantsFullName;

        const listOfContestants = [
            {
                name: firstContestantsFullName,
                col4: "Participating"
            },
            {
                name: secondContestantsFullName,
                col4: "Participating"
            }
        ];

        // Act
        var result = getTeamList(listOfContestants);

        expect(result[0].teamName).toEqual(expectedTeamName);
    });

    it("should not give any team the eliminationOrder of the max teams if there are still Participating contestants", () => {
        const firstContestantsFirstName = "Some";
        const secondContestantsFirstName = "SomeGuys";

        const listOfContestants = [
            {
                name: firstContestantsFirstName + " Guy",
                col4: "Participating"
            },
            {
                name: secondContestantsFirstName + " Brother",
                col4: "Participating"
            },
            {
                name: "blah Guy",
                col4: "Participating"
            },
            {
                name: "meh Brother",
                col4: "Participating"
            },
            {
                name: "lost Guy",
                col4: "Eliminated 1st"
            },
            {
                name: secondContestantsFirstName + "alsoLost Brother",
                col4: "Eliminated 1st"
            }
        ];

        var result = getTeamList(listOfContestants);

        expect(result.map(x => x.eliminationOrder)).not.toContain(3);
    });

    it("should not create any teams when all showContestants are missing the minimum necessary data to be created", () => {
        const listOfContestants = [
            {
                col4: "Participating"
            },
            {
                name: "",
                col4: "Participating"
            },
            {
                name: null,
                col4: "Participating"
            },
        ];

        var result = getTeamList(listOfContestants);

        expect(result.map(x => x.eliminationOrder)).not.toContain(0);
    });

    it("should create as many teams as it can alternating after finding the first and even adding a partial team when there is not a match at the end", () => {
        const listOfContestants = [
            {
                col4: "Participating"
            },
            {
                name: "hi my name is",
                col4: "Participating"
            },
            {
                name: null,
                col4: "Participating"
            },
            {
                name: "new person",
                col4: "Participating"
            },
            {
                name: "new person",
                col4: "Participating"
            },
        ];

        var result = getTeamList(listOfContestants);

        expect(result.map(x => x.eliminationOrder)).not.toContain(2);
    });
});


describe("isPartialContestantData", () => {
    it("should make sure that tableRowData with no name property should return true", () => {
        const inputContestant = {};
        const result = isPartialContestantData(inputContestant);

        expect(result).toBeTruthy();
    });

    it("should make sure that tableRowData with an empty name property should return true", () => {
        const inputContestant = {name: "" };
        const result = isPartialContestantData(inputContestant);

        expect(result).toBeTruthy();
    });

    it("should make sure that tableRowData with a null name property should return true", () => {
        const inputContestant = {name: null};
        const result = isPartialContestantData(inputContestant);

        expect(result).toBeTruthy();
    });

    it("should make sure that tableRowData with a populated name property should return false", () => {
        const inputContestant = {name: "first"};
        const result = isPartialContestantData(inputContestant);

        expect(result).toBeFalsy();
    });

    it("should make sure that tableRowData with a populated name and name2 property should return false", () => {
        const inputContestant = {name: "first", name2: "name"};
        const result = isPartialContestantData(inputContestant);

        expect(result).toBeFalsy();
    });

    it("should make sure that tableRowData with a no name property and only a name2 property should return true", () => {
        const inputContestant = {name2: "name"};
        const result = isPartialContestantData(inputContestant);

        expect(result).toBeTruthy();
    });

    it("should make sure that tableRowData with a no name property and a name2 property and a col2 property should return false", () => {
        const inputContestant = {name2: "name", col2: "value"};
        const result = isPartialContestantData(inputContestant);

        expect(result).toBeFalsy();
    });
});

describe("getCompetingEntityList", () => {
    it("should run", () => {
        // Arrange
        const firstContestantsFirstName = "Some";
        const secondContestantsFirstName = "SomeGuys";

        const listOfContestants = [
            {
                name: firstContestantsFirstName + " Guy",
                col4: "Participating"
            },
            {
                name: secondContestantsFirstName + " Brother",
                col4: "Participating"
            }];

        // Act
        var result = getCompetingEntityList(listOfContestants);

        // Assert
        expect(result).not.toBeNull();
    });

    it("should throw an error for a contestantData w/ a missing status", () => {
        // Arrange
        const firstContestantsFirstName = "Some";
        const secondContestantsFirstName = "SomeGuys";

        const listOfContestants = [
            {
                name: firstContestantsFirstName + " Guy",
                col4: "Participating"
            },
            {name: secondContestantsFirstName + " Brother"}
        ];

        // Act
        var act = () => getCompetingEntityList(listOfContestants);

        // Assert
        expect(act).toThrow(new ReferenceError("Status is either null or undefined and it should not be"));
    });

    it("Should parse out evicted day from their status when it indicates they were evicted", () => {
        const firstContestantsFirstName = "Some";

        const listOfContestants = [
            {
                name: firstContestantsFirstName + " Guy",
                col4: "EvictedDay 10"
            }
        ];

        var result = getCompetingEntityList(listOfContestants);

        expect(result[0].eliminationOrder).toEqual(1);
    });

    it("Should parse out evicted day from their status when it indicates they were evicted even with white space", () => {
        const firstContestantsFirstName = "Some";

        const listOfContestants = [
            {
                name: firstContestantsFirstName + " Guy",
                col4: "Evicted Day 10"
            }
        ];

        var result = getCompetingEntityList(listOfContestants);

        expect(result[0].eliminationOrder).toEqual(1);
    });

    it("Should parse out expelled day from their status when it indicates they were expelled", () => {
        const firstContestantsFirstName = "Some";
        const expectedEliminationOrder = 1;

        const listOfContestants = [
            {
                name: "blah Guy",
                col4: "Participating"
            },
            {
                name: "meh Brother",
                col4: "Participating"
            },
            {
                name: "another guy",
                col4: "Participating"
            },
            {
                name: "his Brother",
                col4: "Participating"
            },
            {
                name: "third guy",
                col4: "Participating"
            },
            {
                name: "thrids Brother",
                col4: "Participating"
            },
            {
                name: firstContestantsFirstName + " Guy",
                col4: "ExpelledDay 7"
            }
        ];

        var result = getCompetingEntityList(listOfContestants);

        expect(result.length).toEqual(listOfContestants.length);

        expect(result[0].eliminationOrder).toEqual(expectedEliminationOrder);
    });

    it("Should parse out exited day from their status when it indicates they exited", () => {
        // This could not be necessary anymore since it was built in for Jared Fields in BB25 which later got changed in [this edit](https://en.wikipedia.org/w/index.php?title=Big_Brother_25_(American_season)&oldid=1222831069)
        const firstContestantsFirstName = "Some";
        const expectedEliminationOrder = 1;

        const listOfContestants = [
            {
                name: "blah Guy",
                col4: "Participating"
            },
            {
                name: firstContestantsFirstName + " Guy",
                col4: "ExitedDay 58"
            }
        ];

        var result = getCompetingEntityList(listOfContestants);

        expect(result.length).toEqual(listOfContestants.length);

        expect(result[0].eliminationOrder).toEqual(expectedEliminationOrder);
    });

    it("Should parse out ending day from status when status is runner-up", () => {
        const firstContestantsFirstName = "Some";
        const expectedEliminationOrder = 1;

        const listOfContestants = [
            {
                name: "blah Guy",
                col4: "Participating"
            },
            {
                name: "meh Brother",
                col4: "Participating"
            },
            {
                name: "another guy",
                col4: "Participating"
            },
            {
                name: "his Brother",
                col4: "Participating"
            },
            {
                name: "third guy",
                col4: "Participating"
            },
            {
                name: "thrids Brother",
                col4: "Participating"
            },
            {
                name: firstContestantsFirstName + " Guy",
                col4: "Runner-upDay 100"
            }
        ];

        var result = getCompetingEntityList(listOfContestants);

        expect(result[0].eliminationOrder).toEqual(expectedEliminationOrder);
    });

    it("Should ensure runner-up entity has a higher elimination order than someone who was evicted on the same day", () => {
        // this accounts for the 3rd final person who get's evicted on finale night
        const runnerUpName = "almost winner";
        const thirdPlaceName = "in thrid";

        const listOfContestants = [
            {
                name: runnerUpName,
                col4: "Runner-UpDay 100"
            },
            {
                name: thirdPlaceName,
                col4: "EvictedDay 100"
            },
            {
                name: "another guy",
                col4: "winner"
            }
        ];

        var result = getCompetingEntityList(listOfContestants);

        expect(result.length).toEqual(3);
        const targetContestantList = result.filter(x => x.teamName == runnerUpName);
        expect(targetContestantList.length).toEqual(1);
        const targetContestantList2 = result.filter(x => x.teamName == thirdPlaceName);
        expect(targetContestantList2.length).toEqual(1);
        expect(targetContestantList[0].eliminationOrder).toBeGreaterThan(targetContestantList2[0].eliminationOrder);
    });

    it("Should make sure an entity with a winner status should end up with eliminationOrder of Number.MAX_VALUE", () => {
        const targetContestantName = "blah Guy";

        const listOfContestants = [
            {
                name: targetContestantName,
                col4: "Winner"
            },
            {
                name: "meh Brother",
                col4: "Participating"
            }
        ];


        var result = getCompetingEntityList(listOfContestants);

        expect(result.length).toEqual(2);
        const targetContestantList = result.filter(x => x.teamName == targetContestantName);
        expect(targetContestantList.length).toEqual(1);
        expect(targetContestantList[0].eliminationOrder).toEqual(Number.MAX_VALUE);
    });

    it("Should make sure an entity with a known \"isParticipating\" status ends up with eliminationOrder of Number.MAX_VALUE", () => {
        const emptyStatusName = "blah Guy";
        const participatingStatusName = "purple Guy";

        const listOfContestants = [
            {
                name: emptyStatusName,
                col4: ""
            },
            {
                name: participatingStatusName,
                col4: "Participating"
            }
        ];


        var result = getCompetingEntityList(listOfContestants);

        expect(result.length).toEqual(2);
        const targetContestantList = result.filter(x => x.teamName == emptyStatusName);
        expect(targetContestantList.length).toEqual(1);
        expect(targetContestantList[0].eliminationOrder).toEqual(Number.MAX_VALUE);
        const targetContestantList2 = result.filter(x => x.teamName == participatingStatusName);
        expect(targetContestantList2.length).toEqual(1);
        expect(targetContestantList2[0].eliminationOrder).toEqual(Number.MAX_VALUE);
    });

    it("Should make sure an entity with an empty status which follows an exit status ends up with eliminationOrder in the bounds of the number of contestants and less than the person before them", () => {
        const followingExitStatusName = "evicted last";
        const emptyStatusName = "blah Guy";

        const listOfContestants = [
            {
                name: followingExitStatusName,
                col4: "EvictedDay 86"
            },
            {
                name: emptyStatusName,
                col4: ""
            },
            {
                name: "first evicted",
                col4: "EvictedDay 10"
            }
        ];


        var result = getCompetingEntityList(listOfContestants);

        expect(result.length).toEqual(3);
        const targetContestantList = result.filter(x => x.teamName == emptyStatusName);
        expect(targetContestantList.length).toEqual(1);
        const targetContestantList2 = result.filter(x => x.teamName == followingExitStatusName);
        expect(targetContestantList2.length).toEqual(1);
        expect(targetContestantList[0].eliminationOrder).toBeLessThan(listOfContestants.length);
        expect(targetContestantList[0].eliminationOrder).toBeLessThan(targetContestantList2[0].eliminationOrder);
    });

    it("Should solve the blue problem by making sure an entity with an empty status which follows an exit status ends up with eliminationOrder in the bounds of the number of contestants", () => {
        const emptyStatusName = "blah Guy";

        const listOfContestants = [
            {
                name: "I am a winner",
                col4: "Winner"
            },
            {
                name: "evicted last",
                col4: "EvictedDay 86"
            },
            {
                name: emptyStatusName,
                col4: ""
            },
            {
                name: "first evicted",
                col4: "EvictedDay 10"
            }
        ];


        var result = getCompetingEntityList(listOfContestants);

        expect(result.length).toEqual(4);
        const targetContestantList = result.filter(x => x.teamName == emptyStatusName);
        expect(targetContestantList.length).toEqual(1);
        expect(targetContestantList[0].isParticipating).toBeFalsy();
    });

    it("Should solve the blue problem while only cross out names for show contestants when they have not been evicted yet", () => {
        const emptyStatusName = "I was the first in a double eviction";
        const amStillCompetingName = "I am still competing";

        const listOfContestants = [
            {
                name: amStillCompetingName,
                col4: ""
            },
            {
                name: amStillCompetingName + "2",
                col4: ""
            },
            {
                name: "evicted last",
                col4: "EvictedDay 86"
            },
            {
                name: emptyStatusName,
                col4: ""
            },
            {
                name: "first evicted",
                col4: "EvictedDay 10"
            }
        ];


        var result = getCompetingEntityList(listOfContestants);

        result.forEach(x => {
            let shouldStillBeCompeting = x.teamName.startsWith(amStillCompetingName);
            expect(x.isParticipating).toEqual(shouldStillBeCompeting);
        });
    });

    it("should not give any competingEntity the eliminationOrder of the max competingEntities if there are still Participating entities", () => {
        const firstContestantsFirstName = "Some";
        const secondContestantsFirstName = "SomeGuys";

        const listOfContestants = [
            {
                name: firstContestantsFirstName + " Guy",
                col4: "Participating"
            },
            {
                name: secondContestantsFirstName + " Brother",
                col4: "Participating"
            },
            {
                name: "blah Guy",
                col4: "Participating"
            },
            {
                name: "meh Brother",
                col4: "Participating"
            },
            {
                name: "lost Guy",
                col4: "EvictedDay 20"
            },
            {
                name: secondContestantsFirstName + "alsoLost Brother",
                col4: "EvictedDay 10"
            }
        ];

        var result = getCompetingEntityList(listOfContestants);

        expect(result.map(x => x.eliminationOrder)).not.toContain(6);
    });

    it("should not create any entities when all showContestants are missing the minimum necessary data to be created", () => {
        const listOfContestants = [
            {
                col4: "Participating"
            },
            {
                name: "",
                col4: "Participating"
            },
            {
                name: null,
                col4: "Participating"
            },
        ];

        var result = getCompetingEntityList(listOfContestants);

        expect(result.length).toEqual(0);
        expect(result.map(x => x.eliminationOrder)).not.toContain(0);
    });
});

describe("stripTableHeader", () => {

    it("Should stip a known header row out of a list of tableRowData", () => {

        // Arrange
        const knownHeaderRow = {
            name: "",
            name2: "Contestants\nAge\nRelationship\nHometown\nStatus",
            col1: "",
            col2: "",
            col3: "",
            col4: "",
            col5: ""
        };
        const tableRowDataList = [knownHeaderRow];

        // Act
        const result = stripTableHeader(tableRowDataList);

        // Assert
        expect(result).not.toBeNull();
        expect(result.length).toBe(0);
    });
});
