import { isPartialContestantData, stripTableHeader } from "../../app/utils/wikiQuery";

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

describe("stripTableHeader", () => {

    it("Should strip a known header row out of a list of tableRowData", () => {

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

    it("Should not strip a knwon good row with 'fully' populated contetantData", () => {

        // Arrange
        const knownGoodRow = {
            name: "Greg Franklin",
            name2: "Greg Franklin",
            col1: "25",
            col2: "Brothers & Computer Scientists",
            col3: "New York City, New York",
            col4: "Winners",
            col5: ""
        };
        const tableRowDataList = [knownGoodRow];

        // Act
        const result = stripTableHeader(tableRowDataList);

        // Assert
        expect(result).not.toBeNull();
        expect(result.length).toBe(1);
    });

    it("Should not strip a knwon good row with partially populated contetantData", () => {

        // Arrange
        const knownGoodRow = {
            name: "John Franklin",
            name2: "John Franklin",
            col1: "27",
            col2: "Mountain View, California",
            col3: "",
            col4: "",
            col5: ""
        };
        const tableRowDataList = [knownGoodRow];

        // Act
        const result = stripTableHeader(tableRowDataList);

        // Assert
        expect(result).not.toBeNull();
        expect(result.length).toBe(1);
    });
});
