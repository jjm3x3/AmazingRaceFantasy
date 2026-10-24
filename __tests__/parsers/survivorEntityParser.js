import parseSurvivorEntities from "@/app/parsers/survivorEntityParser";
import { survivor47WikiTableData } from "@/__tests__/fixtures/survivor47WikiTableData";
import { survivor49WikiTableData } from "@/__tests__/fixtures/survivor49WikiTableData";

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

    it("should give two exits on the same day separate elimination orders based on their placements", () => {
        // From Survivor 50: Charlie's day cell is shared with Angelina's, so
        // both left on Day 11, but their placements put them in separate rounds
        const listOfContestants = [
            {
                name: "Angelina Keeley",
                col3: "Vatu",
                col4: "",
                col5: "5th voted out",
                col6: "Day 11"
            },
            {
                name: "Charlie Davis",
                col3: "Kalo",
                col4: "Cila",
                col5: "",
                col6: "6th voted out"
            }
        ];

        var result = parseSurvivorEntities(listOfContestants);

        expect(result.map(x => [x.teamName, x.eliminationOrder])).toEqual([
            ["Angelina Keeley", 1],
            ["Charlie Davis", 2]
        ]);
    });

    it("should treat a row whose right-most cell is a tribe name as still participating", () => {
        const listOfContestants = [
            {
                name: "first out",
                col3: "Kele",
                col4: "1st voted out",
                col5: "Day 3"
            },
            {
                name: "still playing",
                col3: "Kele",
                col4: "Hina"
            }
        ];

        var result = parseSurvivorEntities(listOfContestants);

        const target = result.find(x => x.teamName == "still playing");
        expect(target.isParticipating).toBe(true);
        expect(target.eliminationOrder).toEqual(Number.MAX_VALUE);
    });

    it("should not read an ordinal out of a 2nd runner-up placement", () => {
        const listOfContestants = [
            {
                name: "fifth out",
                col3: "5th voted out",
                col4: "Day 20"
            },
            {
                name: "third place",
                col3: "Tuku",
                col4: "2nd runner-up",
                col5: "Day 26"
            },
            {
                name: "second place",
                col3: "Gata",
                col4: "Runner-up"
            },
            {
                name: "winner",
                col3: "Sole Survivor"
            }
        ];

        var result = parseSurvivorEntities(listOfContestants);

        expect(result.map(x => [x.teamName, x.eliminationOrder])).toEqual([
            ["fifth out", 1],
            ["third place", 2],
            ["second place", 3],
            ["winner", Number.MAX_VALUE]
        ]);
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
                col4: "Runner-up",
                col5: "Day 100"
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
                col4: "2nd Runner-up",
                col5: "Day 26"
            },
            {
                name: runnerUpName,
                col4: "Runner-up"
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

    it("Should parse out ending day based on previous contestant exit if only placement column exists", () => {
        const firstContestantsFirstName = "Some";
        const expectedEliminationOrder = 2;

        const listOfContestants = [
            {
                name: "first elimed",
                col4: "Medicallyevacuated",
                col5: "Day 3"
            },
            {
                name: firstContestantsFirstName + " Guy",
                col4: "1st voted out"
            },
            {
                name: "blah Guy",
                col4: "Participating"
            },
            {
                name: "thrids Brother",
                col4: "Participating"
            }
        ];

        var result = parseSurvivorEntities(listOfContestants);

        console.log("Teest result");
        console.log(result);

        expect(result[1].eliminationOrder).toEqual(expectedEliminationOrder);
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

    it("should not give any competingEntity the eliminationOrder of the max competingEntities if there are still Participating entities", () => {
        const firstContestantsFirstName = "Some";
        const secondContestantsFirstName = "SomeGuys";

        const listOfContestants = [
            {
                name: secondContestantsFirstName + "alsoLost Brother",
                col3: "1st voted out",
                col4: "Day 3"
            },
            {
                name: "lost Guy",
                col3: "Gata",
                col4: "2nd voted out",
                col5: "Day 5"
            },
            {
                name: firstContestantsFirstName + " Guy",
                col3: "Gata"
            },
            {
                name: secondContestantsFirstName + " Brother",
                col3: "Tuku"
            },
            {
                name: "blah Guy",
                col3: "Lavo"
            },
            {
                name: "meh Brother",
                col3: "Lavo"
            }
        ];

        var result = parseSurvivorEntities(listOfContestants);

        expect(result.map(x => x.eliminationOrder)).toEqual([1, 2, Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE]);
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

    it("should parse the finish day out of col8 when a contestant's row spans all eight columns", () => {
        const listOfContestants = [
            {
                name: "Nicole Mazullo",
                col1: "26",
                col2: "Philadelphia,Pennsylvania",
                col3: "Kele",
                col4: "",
                col5: "",
                col6: "",
                col7: "1st voted out",
                col8: "Day 3"
            },
            {
                name: "Kimberly \"Annie\" Davis",
                col1: "49",
                col2: "Austin,Texas",
                col3: "2nd voted out",
                col4: "Day 5",
                col5: "",
                col6: "",
                col7: "",
                col8: ""
            }
        ];

        var result = parseSurvivorEntities(listOfContestants);

        expect(result.map(x => x.teamName)).toEqual(["Nicole Mazullo", "Kimberly \"Annie\" Davis"]);
        expect(result.map(x => x.eliminationOrder)).toEqual([1, 2]);
    });
});

describe("parseSurvivorEntities characterization against real Wikipedia rows", () => {
    // Pins the current parser's output for full seasons so changes in
    // behavior show up as explicit test diffs.
    function summarize(entities) {
        return entities.map(x => [
            x.teamName,
            x.isParticipating,
            x.eliminationOrder === Number.MAX_VALUE ? "MAX" : x.eliminationOrder
        ]);
    }

    it("should parse Survivor 47 in finish order with the winner still participating", () => {
        const result = parseSurvivorEntities(survivor47WikiTableData);

        expect(summarize(result)).toEqual([
            ["Jon Lovett", false, 1],
            ["TK Foster", false, 2],
            ["Aysha Welch", false, 3],
            ["Kishan Patel", false, 4],
            ["Anika Dhar", false, 5],
            ["Rome Cooney", false, 6],
            ["Tiyana Hallums", false, 7],
            ["Sierra Wright", false, 8],
            ["Sol Yi", false, 9],
            ["Gabe Ortis", false, 10],
            ["Kyle Ostwald", false, 11],
            ["Caroline Vidmar", false, 12],
            ["Andy Rueda", false, 13],
            ["Genevieve Mushaluk", false, 14],
            ["Teeny Chirichillo", false, 15],
            ["Sue Smey", false, 16],
            ["Sam Phalen", false, 17],
            ["Rachel LaMont", true, "MAX"]
        ]);
    });

    it("should parse Survivor 49 in finish order including rows missing their day", () => {
        // Nicole's day is past col7 and Jeremiah's/Sophi's day cell is shared
        // with the row above, so both rely on the "previous day + 0.5" fallback
        const result = parseSurvivorEntities(survivor49WikiTableData);

        expect(summarize(result)).toEqual([
            ["Nicole Mazullo", false, 1],
            ["Kimberly \"Annie\" Davis", false, 2],
            ["Jake Latimer", false, 3],
            ["Jeremiah Ing", false, 4],
            ["Matt Williams", false, 5],
            ["Jason Treul", false, 6],
            ["Shannon Fairweather", false, 7],
            ["Nate Moore", false, 8],
            ["Michelle \"MC\" Chukwujekwu", false, 9],
            ["Alex Moore", false, 10],
            ["Jawan Pitts", false, 11],
            ["Sophie Segreti", false, 12],
            ["Steven Ramm", false, 13],
            ["Kristina Mills", false, 14],
            ["Rizo Velovic", false, 15],
            ["Sage Ahrens-Nichols", false, 16],
            ["Sophi Balerdi", false, 17],
            ["Savannah Louie", true, "MAX"]
        ]);
    });
});
