import { generateContestantRoundScores } from '../../app/utils/contestantUtils'

describe("generateContestantRoundScores", () => {
    it("Should work with simple defaults", () => {
        // Arrange

        // Act
        const result = generateContestantRoundScores([], 0, "")

        // Assert
        expect(result).not.toBeNull()
        expect(result.length).toBe(0)
    })
})
