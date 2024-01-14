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

    it('should throw an error for a contestantData w/ a missing status for second on a team', () => {
        // Arrange
        const firstContestantsFirstName = "Some"
        const secondContestantsFirstName = "SomeGuys"

        const listOfContestants = [
            {
                name: firstContestantsFirstName + " Guy",
                status: "Participating"
            },
            {name: secondContestantsFirstName + " Brother"}
        ]

        // Act
        var act = () => getTeamList(listOfContestants)

        // Assert
        expect(act).toThrow(new ReferenceError("Status is either null or undefined and it should not be"))
    })

    it('Should parse out elimination order a populate it when the team is not participating', () => {
        const firstContestantsFirstName = "Some"
        const secondContestantsFirstName = "SomeGuys"
        const expectedEliminationOrder = 2

        const listOfContestants = [
            {
                name: firstContestantsFirstName + " Guy",
                status: "Eliminated " + expectedEliminationOrder + "nd"
            },
            {
                name: secondContestantsFirstName + " Brother",
                status: "Eliminated " + expectedEliminationOrder + "nd"
            }
        ]

        var result = getTeamList(listOfContestants)

        expect(result.props.runners[0].eliminationOrder).toEqual(2)
    })

    it('Should parse out elimination order when a team is third', () => {
        const firstContestantsFirstName = "Some"
        const secondContestantsFirstName = "SomeGuys"
        const expectedEliminationOrder = 2

        const listOfContestants = [
            {
                name: "blah Guy",
                status: "Participating"
            },
            {
                name: "meh Brother",
                status: "Participating"
            },
            {
                name: "another guy",
                status: "Participating"
            },
            {
                name: "his Brother",
                status: "Participating"
            },
            {
                name: "third guy",
                status: "Participating"
            },
            {
                name: "thrids Brother",
                status: "Participating"
            },
            {
                name: firstContestantsFirstName + " Guy",
                status: "third"
            },
            {
                name: secondContestantsFirstName + " Brother",
                status: "third"
            }
        ]

        var result = getTeamList(listOfContestants)

        expect(result.props.runners[3].eliminationOrder).toEqual(expectedEliminationOrder)
    })

    it('Should parse out elimination order when a team is runners-up', () => {
        const firstContestantsFirstName = "Some"
        const secondContestantsFirstName = "SomeGuys"
        const expectedEliminationOrder = 3

        const listOfContestants = [
            {
                name: "blah Guy",
                status: "Participating"
            },
            {
                name: "meh Brother",
                status: "Participating"
            },
            {
                name: "another guy",
                status: "Participating"
            },
            {
                name: "his Brother",
                status: "Participating"
            },
            {
                name: "third guy",
                status: "Participating"
            },
            {
                name: "thrids Brother",
                status: "Participating"
            },
            {
                name: firstContestantsFirstName + " Guy",
                status: "runners-up"
            },
            {
                name: secondContestantsFirstName + " Brother",
                status: "runners-up"
            }
        ]

        var result = getTeamList(listOfContestants)

        expect(result.props.runners[3].eliminationOrder).toEqual(expectedEliminationOrder)
    })

    it('should create team names based on merging contestants full names two at a time skipping the first empty one', () => {
        // Arrange
        const firstContestantsFullName = "Some" + " Guy"
        const secondContestantsFullName = "SomeGuys" + " Brother"
        const expectedTeamName = firstContestantsFullName + " & " + secondContestantsFullName

        const listOfContestants = [
            {
                name: firstContestantsFullName,
                status: "Participating"
            },
            {
                name: secondContestantsFullName,
                status: "Participating"
            }
        ]

        // Act
        var result = getTeamList(listOfContestants)

        expect(result.props.runners[0].teamName).toEqual(expectedTeamName)
    })

    it('should not give any team the eliminationOrder of the max teams if there are still Participating contestants', () => {
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
            },
            {
                name: "blah Guy",
                status: "Participating"
            },
            {
                name: "meh Brother",
                status: "Participating"
            },
            {
                name: "lost Guy",
                status: "Eliminated 1st"
            },
            {
                name: secondContestantsFirstName + "alsoLost Brother",
                status: "Eliminated 1st"
            }
        ]

        var result = getTeamList(listOfContestants)

        expect(result.props.runners.map(x => x.eliminationOrder)).not.toContain(3)
    })
})
