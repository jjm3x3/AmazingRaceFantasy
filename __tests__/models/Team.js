import Team from '../../app/models/Team'

describe('Team construct', () => {
    it('should construct', () => {
        const aTeam = new Team({
            teamName: "aTeamName"
        })

        expect(aTeam).not.toBeNull()
    })
})
