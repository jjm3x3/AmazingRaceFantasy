import { WIKI_API_URL } from '../leagueConfiguration/AmazingRace_35'
import { CONTESTANT_LEAGUE_DATA } from '../leagueData/AmazingRace_35'
import ContestantSelector from '../components/contestantSelector'
import generateListOfContestantRoundLists from '../generators/contestantRoundListGenerator'

export default async function Scoring() {

    const listOfContestantRoundLists = await generateListOfContestantRoundLists(WIKI_API_URL, CONTESTANT_LEAGUE_DATA)

    return (
        <div>
            <h1 className="text-2xl text-center">Current Scoring for</h1>
            <br/>
            <ContestantSelector listOfContestantRoundLists={listOfContestantRoundLists}/>
        </div>
    )
}
