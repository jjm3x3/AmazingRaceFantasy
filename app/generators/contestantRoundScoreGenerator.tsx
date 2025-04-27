import { ITableRowData } from "../dataSources/wikiFetch";
import { stripTableHeader } from "@/app/utils/wikiQuery";
import { IContestantData } from "@/app/dataSources/dbFetch";
import CompetingEntity from "../models/CompetingEntity";
import League from "../models/League";

interface Dictionary<T> {
    [Key: string]: T;
}

export async function generateContestantRoundScores(
    dataFetcher: () => Promise<ITableRowData[]>,
    getCompetitorList: (_: ITableRowData[]) => CompetingEntity[],
    listOfContestantLeagueData: IContestantData[]
) {
    const wikiTableData = await dataFetcher();

    const wikiContestants = stripTableHeader(wikiTableData);
    // TODO: come up with better names for getCompetitorList and pageData
    const pageData = getCompetitorList(wikiContestants);
    const teamDictionary = pageData.reduce((acc: Dictionary<CompetingEntity>, t: CompetingEntity) => {
        acc[CompetingEntity.getKey(t.teamName)] = t;

        return acc;
    }, {});

    const result: League = new League(pageData);

    listOfContestantLeagueData.map(contestant => {

        const currentSelectedContestantTeamsList = contestant.ranking.map((x: string) => {
            const foundTeam = teamDictionary[CompetingEntity.getKey(x)];
            return foundTeam;
        });

        result.addContestantRoundScores(currentSelectedContestantTeamsList, contestant.name, contestant.handicap);

    });

    return result;
}
