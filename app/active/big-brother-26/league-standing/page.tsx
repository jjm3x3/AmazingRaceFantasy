import { WIKI_API_URL } from '../../../leagueConfiguration/BigBrother_26'
import { CONTESTANT_LEAGUE_DATA } from '../../../leagueData/BigBrother_26'
import LeagueStandingTable from '../../../components/leagueStandingTable/leagueStandingTable';

export default async function LeagueStanding() {
    return <>
        <h1 className="text-3xl text-center">League Standing</h1>
        <br/>
        <LeagueStandingTable wikiApiURL={WIKI_API_URL} sectionTitle="HouseGuests" contestantLeagueData={CONTESTANT_LEAGUE_DATA} competeAsTeam={false} />
    </>
}