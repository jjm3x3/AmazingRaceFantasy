import { getTeamList } from '../app/utils/wikiQuery'

describe('getData', () => {
    it('should run', () => {
        // Arrange
        const firstContestantsFirstName = "Some"
        const secondContestantsFirstName = "SomeGuys"

        const listOfContestants = [
            {
                name: firstContestantsFirstName + " Guy",
                status: "Participating"
            },
            {
                name: secondContestantsFirstName + " Brother",
                status: "Participating"
            }]

        // Act
        var result = getTeamList(listOfContestants)

        // Assert
        expect(result).not.toBeNull()
    })
})
