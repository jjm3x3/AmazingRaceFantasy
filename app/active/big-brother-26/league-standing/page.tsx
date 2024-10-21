import { WIKI_API_URL } from '../../../leagueConfiguration/BigBrother_26'
import { CONTESTANT_LEAGUE_DATA } from '../../../leagueData/BigBrother_26'
import { getWikipediaContestantDataFetcher } from '@/app/utils/wikiFetch';
import { generateContestantRoundScores } from '@/app/generators/contestantRoundScoreGenerator';
import LeagueStandingTable from '../../../components/leagueStandingTable/leagueStandingTable';
import { getCompetingEntityList } from '@/app/utils/wikiQuery';

export default async function LeagueStanding() {
    const dataFetcher = getWikipediaContestantDataFetcher(WIKI_API_URL, "HouseGuests");
    const wikiData = await dataFetcher();
    const pageData = getCompetingEntityList(wikiData);
    const contestantsScores = await generateContestantRoundScores(pageData, CONTESTANT_LEAGUE_DATA);
    return <>
        <h1 className="text-3xl text-center">League Standing</h1>
        <br/>
        <LeagueStandingTable contestantsScores={contestantsScores.rounds} />
    </>
}