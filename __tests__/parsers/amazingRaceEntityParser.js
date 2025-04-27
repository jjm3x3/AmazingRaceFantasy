import parseAmazingRaceEntities from "@/app/parsers/amazingRaceEntityParser";

describe("parseAmazingRaceEntities", () => {
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
        var result = parseAmazingRaceEntities(listOfContestants);

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
        var result = parseAmazingRaceEntities(listOfContestants);

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

        var result = parseAmazingRaceEntities(listOfContestants);

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

        var result = parseAmazingRaceEntities(listOfContestants);

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

        var result = parseAmazingRaceEntities(listOfContestants);

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
        var result = parseAmazingRaceEntities(listOfContestants);

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

        var result = parseAmazingRaceEntities(listOfContestants);

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

        var result = parseAmazingRaceEntities(listOfContestants);

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

        var result = parseAmazingRaceEntities(listOfContestants);

        expect(result.map(x => x.eliminationOrder)).not.toContain(2);
    });
});

