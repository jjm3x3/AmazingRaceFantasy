import { shouldBeScored } from '../../app/utils/teamListUtils'

describe('teamListUtils shouldBeScored', () => {
    it('should be false when there is exactly one team and we are on the first round', () => {
        // Arrange
        const aTeam = {
            isInPlay: (round) => true
        }
        const teamList = [aTeam]

        // Act
        const result = shouldBeScored(teamList, aTeam, 0)

        // Assert
        expect(result).toBeFalsy()
    })

    it('should be false when the target team is in the first position or end of array and its the first round', () => {
        // Arrange
        const aTeam = {
            isInPlay: (round) => true
        }
        const teamList = [{}, aTeam]

        // Act
        const result = shouldBeScored(teamList, aTeam, 0)

        // Assert
        expect(result).toBeFalsy()
    })

    it('should be false when the target team is in the first position or end of array and its the second round round', () => {
        // Arrange
        const aTeam = {
            isInPlay: (round) => true
        }
        const teamList = [{}, aTeam]

        // Act
        const result = shouldBeScored(teamList, aTeam, 1)

        // Assert
        expect(result).toBeFalsy()
    })

    it('should be true when the target team is in the 2nd position or second from the end of array and its the first round', () => {
        // Arrange
        const aTeam = {
            isInPlay: (round) => true
        }
        const teamList = [aTeam, {}]

        // Act
        const result = shouldBeScored(teamList, aTeam, 0)

        // Assert
        expect(result).toBeTruthy()
    })
})
