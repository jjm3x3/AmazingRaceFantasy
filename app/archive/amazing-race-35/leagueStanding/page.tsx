import { WIKI_API_URL } from '../../../leagueConfiguration/AmazingRace_35'
import { CONTESTANT_LEAGUE_DATA } from '../../../leagueData/AmazingRace_35'
import { getWikipediaContestantDataFetcher } from '../../../utils/wikiFetch'
import generateContestantRoundScores from '../../../generators/contestantRoundScoreGenerator'

export default async function LeagueStanding() {

    const dataFetcher = getWikipediaContestantDataFetcher(WIKI_API_URL)
    const contestantScores = await generateContestantRoundScores(dataFetcher, CONTESTANT_LEAGUE_DATA)

    return (
        <div>
            <h1 className="text-3xl text-center">Here is the league standing</h1>
        </div>
    )
}
