import { WIKI_API_URL } from "../../../leagueConfiguration/AmazingRace_35";
import { CONTESTANT_LEAGUE_DATA } from "../../../leagueData/AmazingRace_35";
import { getWikipediaContestantDataFetcher } from "../../../utils/wikiFetch";
import generateContestantRoundScoreComponent from "../../../generators/contestantRoundScoreGenerator";

export default async function LeagueStanding() {
  const dataFetcher = getWikipediaContestantDataFetcher(WIKI_API_URL, "Cast");
  const contestantScoresComponent = await generateContestantRoundScoreComponent(
    dataFetcher,
    CONTESTANT_LEAGUE_DATA,
  );

  return (
    <div>
      <h1 className="text-3xl text-center">League Standing</h1>
      <br />
      {contestantScoresComponent}
    </div>
  );
}
