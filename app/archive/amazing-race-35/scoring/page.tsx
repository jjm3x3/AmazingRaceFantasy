import { WIKI_API_URL, GOOGLE_SHEET_URL } from '../../../leagueConfiguration/AmazingRace_35'
import { CONTESTANT_LEAGUE_DATA } from '../../../leagueData/AmazingRace_35'
import ContestantSelector from '../../../components/contestantSelector'
import { getWikipediaContestantDataFetcher } from '../../../utils/wikiFetch'
import generateListOfContestantRoundLists from '../../../generators/contestantRoundListGenerator'

export default async function Scoring() {

    const dataFetcher = getWikipediaContestantDataFetcher(WIKI_API_URL)
    const listOfContestantRoundLists = await generateListOfContestantRoundLists(dataFetcher, CONTESTANT_LEAGUE_DATA)

    return (
        <div>
            <h1 className="text-2xl text-center">Current Scoring for</h1>
            <br/>
            <ContestantSelector listOfContestantRoundLists={listOfContestantRoundLists}/>
            <p>This seaon was largely managed by Andrew Jaicks using <a className="standard-link" href={GOOGLE_SHEET_URL}>this google sheet</a> which was populdated by him based on SMSs sent by the league contestants.</p>
        </div>
    )
}
