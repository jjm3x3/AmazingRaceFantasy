import { WIKI_API_URL } from '../../../leagueConfiguration/BigBrother_26'
import { CONTESTANT_LEAGUE_DATA } from '../../../leagueData/BigBrother_26'
import { getWikipediaContestantDataFetcher } from '../../../utils/wikiFetch'
import { generateContestantRoundScores } from '@/app/generators/contestantRoundScoreGenerator'
import { getCompetingEntityList } from "../../../utils/wikiQuery"
import generateListOfContestantRoundLists from '../../../generators/contestantRoundListGenerator'
import LeagueStandingTable from '../../../components/leagueStandingTable/leagueStandingTable';

export default async function LeagueStanding() {
    const dataFetcher = getWikipediaContestantDataFetcher(WIKI_API_URL, "HouseGuests");
    const contestantsScoresData = await generateContestantRoundScores(dataFetcher, CONTESTANT_LEAGUE_DATA, false);
    const contestantsScores = contestantsScoresData.rounds[contestantsScoresData.rounds.length-1].contestantRoundData;

    return <>
        <h1 className="text-3xl text-center">League Standing</h1>
        <br/>
        <LeagueStandingTable leagueData={contestantsScores} />
    </>
}