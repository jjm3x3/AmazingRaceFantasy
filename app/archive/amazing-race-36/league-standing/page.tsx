import { WIKI_API_URL } from '../../../leagueConfiguration/AmazingRace_36'
import { CONTESTANT_LEAGUE_DATA } from '../../../leagueData/AmazingRace_36'
import { getWikipediaContestantDataFetcher } from '@/app/utils/wikiFetch';
import LeagueStandingTable from '../../../components/leagueStandingTable/leagueStandingTable';
import { getTeamList } from '@/app/utils/wikiQuery';
import { generateContestantRoundScores } from '@/app/generators/contestantRoundScoreGenerator';

export default async function LeagueStandingComponent() {
    const dataFetcher = getWikipediaContestantDataFetcher(WIKI_API_URL, "Cast");
    const contestantsScores = await generateContestantRoundScores(dataFetcher, getTeamList, CONTESTANT_LEAGUE_DATA);
    return (
        <div>
            <h1 className="text-3xl text-center">League Standing</h1>
            <br/>
            <LeagueStandingTable contestantsScores={contestantsScores.rounds} />
        </div>
    )
}

