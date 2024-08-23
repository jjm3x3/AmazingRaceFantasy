import { WIKI_API_URL } from '../../../leagueConfiguration/AmazingRace_36'
import { CONTESTANT_LEAGUE_DATA } from '../../../leagueData/AmazingRace_36'
import LeagueStandingTable from '../../../components/leagueStandingTable/leagueStandingTable';

export default async function LeagueStanding() {
    return (
        <div>
            <h1 className="text-3xl text-center">League Standing</h1>
            <br/>
            <LeagueStandingTable wikiApiURL={WIKI_API_URL} sectionTitle="Cast" contestantLeagueData={CONTESTANT_LEAGUE_DATA} />
        </div>
    )
}

