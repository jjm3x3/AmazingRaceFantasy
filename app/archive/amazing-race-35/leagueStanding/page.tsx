import { WIKI_API_URL } from '../../../leagueConfiguration/AmazingRace_35'
import { CONTESTANT_LEAGUE_DATA } from '../../../leagueData/AmazingRace_35'
import { getWikipediaContestantDataFetcher } from '../../../utils/wikiFetch'
import generateContestantRoundScores from '../../../generators/contestantRoundScoreGenerator'

export default function LeagueStanding() {

    const dataFetcher = getWikipediaContestantDataFetcher(WIKI_API_URL)
    
    return (
        <h1>Here is the league standing: placeholder...</h1>
    )
}
