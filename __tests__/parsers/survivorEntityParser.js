import parseSurvivorEntities from "@/app/parsers/survivorEntityParser";

describe("parseSurvivorEntities", () => {
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
        var result = parseSurvivorEntities(listOfContestants);

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
        var act = () => parseSurvivorEntities(listOfContestants);

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

        var result = parseSurvivorEntities(listOfContestants);

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

        var result = parseSurvivorEntities(listOfContestants);

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

        var result = parseSurvivorEntities(listOfContestants);

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

        var result = parseSurvivorEntities(listOfContestants);

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

        var result = parseSurvivorEntities(listOfContestants);

        expect(result[0].eliminationOrder).toEqual(expectedEliminationOrder);
    });

    it("Should ensure runner-up entity has a higher elimination order than someone who was the second runner-up", () => {
        // this accounts for the 3rd final person who get's evicted on finale night
        const runnerUpName = "almost winner";
        const thirdPlaceName = "in thrid";

        const listOfContestants = [
            {
                name: thirdPlaceName,
                col4: "2nd runner-up",
                col5: "Day 26"
            },
            {
                name: runnerUpName,
                col4: "Runner-Up"
            },
            {
                name: "another guy",
                col4: "Sole Survivor"
            }
        ];

        var result = parseSurvivorEntities(listOfContestants);

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


        var result = parseSurvivorEntities(listOfContestants);

        expect(result.length).toEqual(2);
        const targetContestantList = result.filter(x => x.teamName == targetContestantName);
        expect(targetContestantList.length).toEqual(1);
        expect(targetContestantList[0].eliminationOrder).toEqual(Number.MAX_VALUE);
    });

    it("Should make sure an entity with a known \"isParticipating\" status ends up with eliminationOrder of Number.MAX_VALUE", () => {
        const participatingStatusName = "purple Guy";

        const listOfContestants = [
            {
                name: participatingStatusName,
                col4: "Participating"
            }
        ];


        var result = parseSurvivorEntities(listOfContestants);

        expect(result.length).toEqual(1);
        const targetContestantList2 = result.filter(x => x.teamName == participatingStatusName);
        expect(targetContestantList2.length).toEqual(1);
        expect(targetContestantList2[0].eliminationOrder).toEqual(Number.MAX_VALUE);
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


        var result = parseSurvivorEntities(listOfContestants);

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


        var result = parseSurvivorEntities(listOfContestants);

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

        var result = parseSurvivorEntities(listOfContestants);

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

        var result = parseSurvivorEntities(listOfContestants);

        expect(result.length).toEqual(0);
        expect(result.map(x => x.eliminationOrder)).not.toContain(0);
    });
});

