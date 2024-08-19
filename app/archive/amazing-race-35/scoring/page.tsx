import { WIKI_API_URL, GOOGLE_SHEET_URL } from '../../../leagueConfiguration/AmazingRace_35'
import { CONTESTANT_LEAGUE_DATA } from '../../../leagueData/AmazingRace_35'
import ContestantSelector from '../../../components/contestantSelector'
import { getWikipediaContestantDataFetcher } from '../../../utils/wikiFetch'
import generateListOfContestantRoundLists from '../../../generators/contestantRoundListGenerator'
import { kv } from "@vercel/kv"

async function getContestantData(): Promise<any[]> {
    const userCursor = await kv.scan("0", {match: "amazing_race:35:*"})
    console.log(userCursor)
    const userLeagueKeys = userCursor[1] // get's the list of keys in the cursor
    const userList = []
    for (let i = 0; i < userLeagueKeys.length; i++) {
        const userData = await kv.json.get(userLeagueKeys[i])
        userList.push(userData)
    }
    console.log(userList)

    return userList
}

export default async function Scoring() {

    const dataFetcher = getWikipediaContestantDataFetcher(WIKI_API_URL, "Cast")
    const listOfContestantRoundLists = await generateListOfContestantRoundLists(dataFetcher, await getContestantData())

    return (
        <div>
            <h1 className="text-2xl text-center">Scoring For</h1>
            <br/>
            <ContestantSelector listOfContestantRoundLists={listOfContestantRoundLists}/>
            <p>This season was largely managed by Andrew Jaicks using <a className="standard-link" href={GOOGLE_SHEET_URL}>this google sheet</a> which was populated by him based on SMSs sent by the league contestants.</p>
            <br/>
        </div>
    )
}
