import { getParser } from "@/app/utils/entityParserSwitch"

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

});
