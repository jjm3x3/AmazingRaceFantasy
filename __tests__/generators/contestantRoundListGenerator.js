import generateListOfContestantRoundLists from "@/app/generators/contestantRoundListGenerator"
import parseAmazingRaceEntities from "@/app/parsers/amazingRaceEntityParser";

describe("generateListOfContestantRoundLists", () => {

    it("Should pass parserOptions to the parsing function", async () => {

        // Arrange
        const tableRowData = [{ name: "Some person", col4: "Eliminated 1st" }];
        const testDataFetcher = () => Promise.resolve(tableRowData);
        const parsingFn = jest.fn(parseAmazingRaceEntities);
        const parserOptions = { dayOverrides: [3] };

        // Act
        await generateListOfContestantRoundLists(testDataFetcher, [], parsingFn, parserOptions);

        // Assert
        expect(parsingFn).toHaveBeenCalledWith(tableRowData, parserOptions);
    });
});
