import { generateContestantRoundScores } from '../../app/utils/contestantUtils'

describe("generateContestantRoundScores", () => {
    it("Should work with simple defaults", () => {
        // Arrange
        const rounds = 0

        // Act
        const result = generateContestantRoundScores([], rounds, "")

        // Assert
        expect(result).not.toBeNull()
        expect(result.length).toBe(0)
    })

    it("Should work with one round", () => {
        // Arrange
        const rounds = 1

        // Act
        const result = generateContestantRoundScores([], rounds, "")

        // Assert
        expect(result).not.toBeNull()
        expect(result.length).toBe(1)
    })
})
