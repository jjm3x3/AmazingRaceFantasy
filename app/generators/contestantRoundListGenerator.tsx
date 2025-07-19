import { stripTableHeader } from "../utils/wikiQuery";
import { IContestantData } from "@/app/dataSources/dbFetch";
import { ITableRowData } from "../dataSources/wikiFetch";
import CompetingEntity from "../models/CompetingEntity";
import ContestantRoundList from "../components/contestantRoundList";
import IRound from "../models/IRound";
import League from "../models/League";

export default async function generateListOfContestantRoundLists(
    dataFetcher: () => Promise<ITableRowData[]>,
    listOfContestantLeagueData: IContestantData[],
    getCompetingEntityListFunction: (_: ITableRowData[]) => CompetingEntity[],
) {
    const wikiTableData = await dataFetcher();

    const wikiContestants = stripTableHeader(wikiTableData);

    const pageData = getCompetingEntityListFunction(wikiContestants);

    const league = new League(pageData);

    const reverseTeamsList = [...pageData].reverse();

    const perfectScoreHandicap = 0;
    const roundScores: IRound[] = league.generateContestantRoundScores(reverseTeamsList, "*perfect*", perfectScoreHandicap);

    return listOfContestantLeagueData.map(contestant => {

        const currentSelectedContestantTeamsList = league.getTeamList(contestant.ranking);

        const contestantRoundScores: IRound[] = league.generateContestantRoundScores(currentSelectedContestantTeamsList, contestant.name, contestant.handicap);

        return {
            key: contestant.name,
            content: <ContestantRoundList
                perfectRoundScores={roundScores}
                contestantRoundScores={contestantRoundScores}
                perfectTeamList={reverseTeamsList}
                contestantTeamList={currentSelectedContestantTeamsList}
                contestantName={contestant.name}
            />
        };
    });
}

