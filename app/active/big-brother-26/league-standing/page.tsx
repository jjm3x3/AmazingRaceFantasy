import { WIKI_API_URL } from '../../../leagueConfiguration/BigBrother_26'
import { CONTESTANT_LEAGUE_DATA } from '../../../leagueData/BigBrother_26'
import { getWikipediaContestantDataFetcher } from '../../../utils/wikiFetch'
import { getCompetingEntityList } from "../../../utils/wikiQuery"
import generateListOfContestantRoundLists from '../../../generators/contestantRoundListGenerator'
import LeagueStandingTable from '../../../components/leagueStandingTable/leagueStandingTable';

export default async function LeagueStanding() {
    const dataFetcher = getWikipediaContestantDataFetcher(WIKI_API_URL, "HouseGuests")
    const contestantScoresData = await generateListOfContestantRoundLists(dataFetcher, CONTESTANT_LEAGUE_DATA, getCompetingEntityList)
    const contestantsScores:any[] = [];
    contestantScoresData.forEach(contestant => {
        const contestantRounds = contestant.content.props.contestantRoundScores;
        const mostRecentRound = contestantRounds[contestantRounds.length - 1].contestantRoundData[0];
        contestantsScores.push(mostRecentRound);

    })

    return <>
        <h1 className="text-3xl text-center">League Standing</h1>
        <br/>
        <LeagueStandingTable leagueData={contestantsScores} />
    </>
}