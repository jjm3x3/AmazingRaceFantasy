import { getParser, parseEntities } from "@/app/utils/entityParserSwitch"

describe("getParser", () => {

    it("Should return a parser which can handle 'eliminated' status for amazing_race", () => {

        // Arrange
        const tableRowData = [
            {
                name: "Some person",
                col4: "Eliminated 4th"
            }
        ];

        // Act
        const parserSutFn = getParser("amazing_race");

        const parsedEntities = parserSutFn(tableRowData);

        // Assert
        expect(parsedEntities).not.toBeNull();
        expect(parsedEntities.length).toBe(1);
        expect(parsedEntities[0].isParticipating).toBeFalsy();
        expect(parsedEntities[0].eliminationOrder).toBe(4);
    });

    it("Should return a parser which can colate teams for amazing_race", () => {

        // Arrange
        const tableRowData = [
            {
                name: "Some person",
                col4: "Eliminated 4th"
            },
            {
                name: "Some personsbrother",
                col4: ""
            }
        ];

        // Act
        const parserSutFn = getParser("amazing_race");

        const parsedEntities = parserSutFn(tableRowData);

        // Assert
        expect(parsedEntities).not.toBeNull();
        expect(parsedEntities.length).toBe(1); // main test
        expect(parsedEntities[0].isParticipating).toBeFalsy();
        expect(parsedEntities[0].eliminationOrder).toBe(4);
    });

    it("Should return a parser which creates an entity per row for big_brother", () => {

        // Arrange
        const tableRowData = [
            {
                name: "Some person",
                col4: "Eliminated 4th"
            },
            {
                name: "Some personsbrother",
                col4: ""
            }
        ];

        // Act
        const parserSutFn = getParser("big_brother");

        const parsedEntities = parserSutFn(tableRowData);

        // Assert
        expect(parsedEntities).not.toBeNull();
        expect(parsedEntities.length).toBe(2);
    });

    it("Should return a parser which can handle 'evicted' for big_brother", () => {

        // Arrange
        const tableRowData = [
            {
                name: "Some person",
                col4: "EvictedDay 10"
            },
            {
                name: "Some personsbrother",
                col4: "Winner"
            }
        ];

        // Act
        const parserSutFn = getParser("big_brother");

        const parsedEntities = parserSutFn(tableRowData);

        // Assert
        expect(parsedEntities).not.toBeNull();
        expect(parsedEntities.length).toBe(2);
        expect(parsedEntities[0].isParticipating).toBeFalsy();
        expect(parsedEntities[0].eliminationOrder).toBe(1);
    });

    it("Should return a parser for survivor which applies parserOptions", () => {

        // Arrange
        const tableRowData = [
            { name: "First Out", col3: "Tribe", col4: "1st voted out", col5: "Day 3" },
            { name: "Second Out", col3: "Tribe", col4: "2nd voted out", col5: "Day 3" }
        ];

        // Act
        const parserSutFn = getParser("survivor");

        const parsedEntities = parserSutFn(tableRowData, { dayOverrides: [3] });

        // Assert
        expect(parsedEntities.map(x => x.eliminationOrder)).toEqual([1, 1]);
    });

    it.each([
        ["amazing_race", [{ name: "Some person", col4: "Eliminated 4th" }]],
        ["big_brother", [{ name: "Some person", col4: "EvictedDay 10" }, { name: "Some personsbrother", col4: "Winner" }]]
    ])("Should return a parser for %s which ignores parserOptions", (showName, tableRowData) => {

        // Act
        const parserSutFn = getParser(showName);

        // Assert
        expect(parserSutFn(tableRowData, { dayOverrides: [10] })).toEqual(parserSutFn(tableRowData));
    });
});

describe("parseEntities", () => {

    it("Should pass parserOptions to the parser", () => {

        // Arrange
        const tableRowData = [
            { name: "First Out", col3: "Tribe", col4: "1st voted out", col5: "Day 3" },
            { name: "Second Out", col3: "Tribe", col4: "2nd voted out", col5: "Day 3" }
        ];

        // Act
        const parsedEntities = parseEntities(tableRowData, "survivor", { dayOverrides: [3] });

        // Assert
        expect(parsedEntities.map(x => x.eliminationOrder)).toEqual([1, 1]);
    });
});
