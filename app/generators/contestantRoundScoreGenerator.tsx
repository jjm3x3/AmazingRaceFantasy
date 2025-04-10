import { ITableRowData } from "../dataSources/wikiFetch";
import { IContestantData } from "@/app/dataSources/dbFetch";
import Team from "../models/Team";
import League from "../models/League";

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

    const result: League = new League(pageData);

    listOfContestantLeagueData.map(contestant => {

        const currentSelectedContestantTeamsList = contestant.ranking.map((x: string) => {
            const foundTeam = teamDictionary[Team.getKey(x)];
            return foundTeam;
        });

        result.addContestantRoundScores(currentSelectedContestantTeamsList, contestant.name, contestant.handicap);

    });

    return result;
}
