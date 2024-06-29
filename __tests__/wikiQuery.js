import { getTeamList } from '../app/utils/wikiQuery'

describe('getData', () => {
    it('should run', () => {
        // Arrange
        const firstContestantsFirstName = "Some"
        const secondContestantsFirstName = "SomeGuys"

        const listOfContestants = [
            {
                name: firstContestantsFirstName + " Guy",
                col4: "Participating"
            },
            {
                name: secondContestantsFirstName + " Brother",
                col4: "Participating"
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
                col4: "Participating"
            },
            {name: secondContestantsFirstName + " Brother"}
        ]

        // Act
        var act = () => getTeamList(listOfContestants)

        // Assert
        expect(act).toThrow(new ReferenceError("Status is either null or undefined and it should not be"))
    })

    it('Should parse out elimination order and populate it when the team is not participating', () => {
        const firstContestantsFirstName = "Some"
        const secondContestantsFirstName = "SomeGuys"
        const expectedEliminationOrder = 2

        const listOfContestants = [
            {
                name: firstContestantsFirstName + " Guy",
                col4: "Eliminated " + expectedEliminationOrder + "nd"
            },
            {
                name: secondContestantsFirstName + " Brother",
                col4: "Eliminated " + expectedEliminationOrder + "nd"
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
                col4: "Participating"
            },
            {
                name: "meh Brother",
                col4: "Participating"
            },
            {
                name: "another guy",
                col4: "Participating"
            },
            {
                name: "his Brother",
                col4: "Participating"
            },
            {
                name: "third guy",
                col4: "Participating"
            },
            {
                name: "thrids Brother",
                col4: "Participating"
            },
            {
                name: firstContestantsFirstName + " Guy",
                col4: "third"
            },
            {
                name: secondContestantsFirstName + " Brother",
                col4: "third"
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
                col4: "Participating"
            },
            {
                name: "meh Brother",
                col4: "Participating"
            },
            {
                name: "another guy",
                col4: "Participating"
            },
            {
                name: "his Brother",
                col4: "Participating"
            },
            {
                name: "third guy",
                col4: "Participating"
            },
            {
                name: "thrids Brother",
                col4: "Participating"
            },
            {
                name: firstContestantsFirstName + " Guy",
                col4: "runners-up"
            },
            {
                name: secondContestantsFirstName + " Brother",
                col4: "runners-up"
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
                col4: "Participating"
            },
            {
                name: secondContestantsFullName,
                col4: "Participating"
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
                col4: "Participating"
            },
            {
                name: secondContestantsFirstName + " Brother",
                col4: "Participating"
            },
            {
                name: "blah Guy",
                col4: "Participating"
            },
            {
                name: "meh Brother",
                col4: "Participating"
            },
            {
                name: "lost Guy",
                col4: "Eliminated 1st"
            },
            {
                name: secondContestantsFirstName + "alsoLost Brother",
                col4: "Eliminated 1st"
            }
        ]

        var result = getTeamList(listOfContestants)

        expect(result.props.runners.map(x => x.eliminationOrder)).not.toContain(3)
    })
})
