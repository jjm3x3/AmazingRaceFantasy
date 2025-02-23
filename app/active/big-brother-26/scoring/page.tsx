import { WIKI_API_URL, GOOGLE_SHEET_URL } from '../../../leagueConfiguration/BigBrother_26'
import { CONTESTANT_LEAGUE_DATA } from '../../../leagueData/BigBrother_26'
import ContestantSelector from '../../../components/contestantSelector'
import { getCompetingEntityList } from "../../../utils/wikiQuery"
import { getWikipediaContestantDataFetcher } from '../../../utils/wikiFetch'
import generateListOfContestantRoundLists from '../../../generators/contestantRoundListGenerator'

export default async function Scoring() {

    const dataFetcher = getWikipediaContestantDataFetcher(WIKI_API_URL, "Houseguests")

    const listOfContestantRoundLists = await generateListOfContestantRoundLists(dataFetcher, CONTESTANT_LEAGUE_DATA, getCompetingEntityList)

    return (
        <div>
            <h1 className="text-2xl text-center">Scoring For</h1>
            <br/>
            <ContestantSelector listOfContestantRoundLists={listOfContestantRoundLists}/>
            <p>This season's contestant data has been sourced from <a className="standard-link" href={GOOGLE_SHEET_URL}>this google sheet</a> which was populated using a google form.</p>
            <br/>
        </div>
    )
}
