import CompetingEntity from "@/app/models/CompetingEntity";

describe("Team construct", () => {
    it("should construct", () => {
        const aTeam = new CompetingEntity({
            teamName: "aTeamName"
        });

        expect(aTeam).not.toBeNull();
    });
});

describe("Team isInPlay", () => {
    it("should be true when elimination order is 0 reguardless of eliminationOrder (sparse)", () => {
        const aTeam = new CompetingEntity({
            isParticipating: true,
            eliminationOrder: 0
        });

        // Assert, just check sections because otherwise it takes too long
        for (let i = Number.MAX_VALUE - 100; i < Number.MAX_VALUE; i++) {
            expect(aTeam.isInPlay(i)).toBeTruthy();
        }
        for (let i = Number.MIN_VALUE + 100; i > Number.MIN_VALUE; i--) {
            expect(aTeam.isInPlay(i)).toBeTruthy();
        }
        for (let i = 0 - 100; i < 100; i++) {
            expect(aTeam.isInPlay(i)).toBeTruthy();
        }
    });

    it("should be false if passed in eliminationOrder and instance eliminationOrder are exactly the same", () => {

        for (let i = 0 - 100; i < 100; i++) {
            if (i === 0) { continue; } // This was already coverd in the last test

            // Arrange
            const aTeam = new CompetingEntity({
                eliminationOrder: i
            });

            // Act, Assert
            expect(aTeam.eliminationOrder).toBe(i);
            expect(aTeam.isInPlay(i)).toBeFalsy();
        }
    });

    it("should be true if passed in eliminationOrder is one less than instance eliminationOrder", () => {

        for (let i = 0 - 100; i < 100; i++) {
            if (i === 0) { continue; } // This was already coverd in the last test

            // Arrange
            const aTeam = new CompetingEntity({
                eliminationOrder: i
            });

            // Act, Assert
            expect(aTeam.eliminationOrder).toBe(i);
            expect(aTeam.isInPlay(i-1)).toBeTruthy();
        }
    });
});

describe("Team static getKey", () => {
    it("should produce the same result regardless of the order of the team contestant", () => {

        // Arrange
        const orderingOne = "Aname one & Bname two";
        const orderingTwo = "Bname two & Aname one";

        // Act
        const resultOne = CompetingEntity.getKey(orderingOne);
        const resultTwo = CompetingEntity.getKey(orderingTwo);

        // Assert
        expect(resultOne).toBe(resultTwo);
    });

    it("should produce the same result ignoring trailing whitespace", () => {

        // Arrange
        const expectedTeamName = "Aname one & Bname two";
        const testTeamName = "Aname one & Bname two   ";

        // Act
        const expectedResult = CompetingEntity.getKey(expectedTeamName);
        const testResult = CompetingEntity.getKey(testTeamName);

        // Assert
        expect(testResult).toBe(expectedResult);
    });

    it("should produce the same result ignoring leading whitespace", () => {

        // Arrange
        const expectedTeamName = "Aname one & Bname two";
        const testTeamName = "   Aname one & Bname two";

        // Act
        const expectedResult = CompetingEntity.getKey(expectedTeamName);
        const testResult = CompetingEntity.getKey(testTeamName);

        // Assert
        expect(testResult).toBe(expectedResult);
    });

    it("should return a string with no quotes when it doesn't have an &", () => {
        // Arrange
        var input = "firstName \"nickname\" lastName";

        // Act
        const result = CompetingEntity.getKey(input);

        // Assert
        expect(result).toEqual(expect.not.stringContaining("\""));
    });

    it("should return a string with no spaces when it doesn't have an &", () => {
        // Arrange
        var input = "firstName lastName";

        // Act
        const result = CompetingEntity.getKey(input);

        // Assert
        expect(result).toEqual(expect.not.stringContaining(" "));
    });
});

describe("Team friendlyName", () => {
    it("shoud return a team with a member with two firstNames when one of their names is Anna Leigh", () => { 

        // Arrange
        const expectedFirstName = "Anna Leigh";
        const sut = new CompetingEntity({teamName: expectedFirstName + " lastname & Partner Person"});

        // Act
        const result = sut.friendlyName();

        // Assert
        expect(result).toContain(expectedFirstName);
    });

    it("shoud return a team with two firstNames one for each player when nither of their first names match the predefined list", () => { 

        // Arrange
        const expectedFirstFirstName = "Bob";
        const expectedSecondFirstName = "Partner";
        const sut = new CompetingEntity({
            teamName: expectedFirstFirstName + " Lob Law & " + expectedSecondFirstName +" Peter Piper"
        });

        // Act
        const result = sut.friendlyName();

        // Assert
        expect(result).toContain(expectedFirstFirstName);
        expect(result).toContain(expectedSecondFirstName);
    });

    it("should return the teamName as is when there is no & in the name", () => {
        // Not a hard requrement, more just wanting to capture some default behavior

        // Arrange
        const fullName = "some long name \"with\" \"quotes\"";
        const sut = new CompetingEntity({teamName: fullName});

        // Act
        const result = sut.friendlyName();

        // Assert
        expect(result).toEqual(fullName);
    });
});
