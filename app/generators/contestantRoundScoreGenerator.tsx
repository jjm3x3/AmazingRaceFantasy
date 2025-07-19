import { ITableRowData } from "../dataSources/wikiFetch";
import { stripTableHeader } from "@/app/utils/wikiQuery";
import { IContestantData } from "@/app/dataSources/dbFetch";
import CompetingEntity from "../models/CompetingEntity";
import League from "../models/League";

export async function generateContestantRoundScores(
    dataFetcher: () => Promise<ITableRowData[]>,
    getCompetitorList: (_: ITableRowData[]) => CompetingEntity[],
    listOfContestantLeagueData: IContestantData[]
) {
    const wikiTableData = await dataFetcher();

    const wikiContestants = stripTableHeader(wikiTableData);
    // TODO: come up with better names for getCompetitorList and pageData
    const pageData = getCompetitorList(wikiContestants);

    const result: League = new League(pageData);

    listOfContestantLeagueData.map(contestant => {

        result.addContestantRoundScores(contestant.ranking, contestant.name, contestant.handicap);

    });

    return result;
}
