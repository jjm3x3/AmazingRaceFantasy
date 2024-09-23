import { WIKI_API_URL } from '../../../leagueConfiguration/AmazingRace_36'
import { CONTESTANT_LEAGUE_DATA } from '../../../leagueData/AmazingRace_36'
import { getWikipediaContestantDataFetcher } from '@/app/utils/wikiFetch';
import LeagueStanding from '@/app/models/LeagueStanding';
import LeagueStandingTable from '../../../components/leagueStandingTable/leagueStandingTable';

export default async function LeagueStandingComponent() {
    const dataFetcher = await getWikipediaContestantDataFetcher(WIKI_API_URL, "Cast");
    const { generateContestantRoundScores } = LeagueStanding;
    const contestantsScores = await generateContestantRoundScores(dataFetcher, CONTESTANT_LEAGUE_DATA);
    return (
        <div>
            <h1 className="text-3xl text-center">League Standing</h1>
            <br/>
            <LeagueStandingTable contestantsScores={contestantsScores} />
        </div>
    )
}

