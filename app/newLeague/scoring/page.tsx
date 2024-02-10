import { WIKI_API_URL } from '../../leagueConfiguration/AmazingRace_36'
import { CONTESTANT_LEAGUE_DATA } from '../../leagueData/AmazingRace_36'
import ContestantSelector from '../../components/contestantSelector'
import GenerateContestantRoundList from '../../generators/contestantRoundListGenerator'

export default async function Scoring() {

    const listOfContestantRoundLists = await Promise.all(CONTESTANT_LEAGUE_DATA.map(async x => {

        try {
            const contestantRoundList = await GenerateContestantRoundList(WIKI_API_URL, x.ranking)

            return {
                key: x.name,
                content: contestantRoundList
            }
        } catch (error) {
            console.error("An error occrured generating a contestantRoundList: " + error)
        }
    }))

    return (
        <div>
            <h1 className="text-2xl text-center">Current Scoring for</h1>
            <br/>
            <ContestantSelector listOfContestantRoundLists={listOfContestantRoundLists}/>
        </div>
    )
}
