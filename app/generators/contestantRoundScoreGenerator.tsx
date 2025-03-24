import { ITableRowData } from "../dataSources/wikiFetch";
import { IContestantData } from "@/app/dataSources/dbFetch";
import { getNumberOfRounds } from "../utils/teamListUtils";
import Team from "../models/Team";
import League from "../models/LeagueStanding";

interface Dictionary<T> {
    [Key: string]: T;
}

export async function generateContestantRoundScores(
    dataFetcher: () => Promise<ITableRowData[]>,
    getCompetitorList: (_: ITableRowData[]) => Team[],
    listOfContestantLeagueData: IContestantData[]
) {
    const wikiData = await dataFetcher();
    // TODO: come up with better names for getCompetitorList and pageData
    const pageData = getCompetitorList(wikiData);
    const teamDictionary = pageData.reduce((acc: Dictionary<Team>, t: Team) => {
        acc[Team.getKey(t.teamName)] = t;

        return acc;
    }, {});
    const numberOfRounds = getNumberOfRounds(pageData);

    const result: League = new League();

    listOfContestantLeagueData.map(contestant => {

        const currentSelectedContestantTeamsList = contestant.ranking.map((x: string) => {
            const foundTeam = teamDictionary[Team.getKey(x)];
            return foundTeam;
        });

        result.addContestantRoundScores(currentSelectedContestantTeamsList, numberOfRounds, contestant.name, contestant.handicap);

    });

    return result;
}
