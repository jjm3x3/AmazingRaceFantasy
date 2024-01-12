import { shouldBeScored } from '../../app/utils/teamListUtils'

describe('teamListUtils shouldBeScored', () => {
    it('should be false when position and round are equal', () => {
        // Arrange
        const aTeam = {
            isInPlay: (round) => true
        }

        // Act
        const result = shouldBeScored(aTeam, 0, 0)

        // Assert
        expect(result).toBeFalsy()
    })

    it('should be false when position is 1 more than the round', () => {
        // Arrange
        const aTeam = {
            isInPlay: (round) => true
        }

        // Act
        const result = shouldBeScored(aTeam, 1, 0)

        // Assert
        expect(result).toBeFalsy()
    })

    it('should be false when position is 2 more than the round', () => {
        // Arrange
        const aTeam = {
            isInPlay: (round) => true
        }

        // Act
        const result = shouldBeScored(aTeam, 2, 0)

        // Assert
        expect(result).toBeTruthy()
    })
})
