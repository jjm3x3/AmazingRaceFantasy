import { generateContestantRoundScores } from '../../app/utils/contestantUtils'
import Team from '../../app/models/Team'

describe("generateContestantRoundScores", () => {
    it("Should work with simple defaults", () => {
        // Arrange
        const teamList  = []
        const rounds = 0

        // Act
        const result = generateContestantRoundScores(teamList, rounds, "")

        // Assert
        expect(result).not.toBeNull()
        expect(result.length).toBe(0)
    })

    it("Should work with one round", () => {
        // Arrange
        const teamList  = []
        const rounds = 1

        // Act
        const result = generateContestantRoundScores(teamList, rounds, "")

        // Assert
        expect(result).not.toBeNull()
        expect(result.length).toBe(1)
        expect(result[0].contestantRoundData).not.toBeNull()
        expect(result[0].contestantRoundData.length).toBe(1)
    })

    it("Should work with one round and one team in the ranking", () => {
        // Arrange
        const teamList = [new Team({teamName: "name1_1 & name1_2"})]
        const rounds = 1

        // Act
        const result = generateContestantRoundScores(teamList, rounds, "")

        // Assert
        expect(result).not.toBeNull()
        expect(result.length).toBe(1)
        expect(result[0].contestantRoundData).not.toBeNull()
        expect(result[0].contestantRoundData.length).toBe(1)
    })
})
