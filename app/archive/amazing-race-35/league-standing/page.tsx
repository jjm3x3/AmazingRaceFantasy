import { WIKI_API_URL } from '../../../leagueConfiguration/AmazingRace_35'
import { CONTESTANT_LEAGUE_DATA } from '../../../leagueData/AmazingRace_35'
import { getWikipediaContestantDataFetcher } from '../../../utils/wikiFetch'
import { generateContestantRoundScores } from '../../../generators/contestantRoundScoreGenerator'
import LeagueStandingTable from '../../../components/leagueStandingTable/leagueStandingTable';

export default async function LeagueStanding() {

    const dataFetcher = getWikipediaContestantDataFetcher(WIKI_API_URL, "Cast")
    const contestantScoresData = await generateContestantRoundScores(dataFetcher, CONTESTANT_LEAGUE_DATA, true);
    const contestantScores = contestantScoresData.rounds[contestantScoresData.rounds.length-1].contestantRoundData;
    
    return (
        <div>
            <h1 className="text-3xl text-center">League Standing</h1>
            <br/>
            <LeagueStandingTable leagueData={contestantScores} />
        </div>
    )
}

