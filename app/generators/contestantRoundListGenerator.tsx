import { getTeamList } from "../utils/wikiQuery";
import { IContestantData } from "@/app/dataSources/dbFetch";
import { ITableRowData } from "../dataSources/wikiFetch";
import Team from "../models/Team";
import ContestantRoundList from "../components/contestantRoundList";
import IRound from "../models/IRound";
import League from "../models/League";

interface Dictionary<T> {
    [Key: string]: T;
}

export default async function generateListOfContestantRoundLists(
    dataFetcher: () => Promise<ITableRowData[]>,
    listOfContestantLeagueData: IContestantData[],
    getCompetingEntityListFunction: (_: ITableRowData[]) => Team[] = getTeamList,
) {
    const wikiContestants = await dataFetcher();
    const pageData = getCompetingEntityListFunction(wikiContestants);

    const teamDictionary = pageData.reduce((acc: Dictionary<Team>, t: Team) => {
        acc[Team.getKey(t.teamName)] = t;

        return acc;
    }, {});

    const league = new League(pageData);
    const numberOfRounds = league.getNumberOfRounds();

    const reverseTeamsList = [...pageData].reverse();

    const perfectScoreHandicap = 0;
    const roundScores: IRound[] = league.generateContestantRoundScores(reverseTeamsList, numberOfRounds, "*perfect*", perfectScoreHandicap);

    return listOfContestantLeagueData.map(contestant => {
        const currentSelectedContestantTeamsList = contestant.ranking.map((x: string) => {
            const teamKey = Team.getKey(x);
            const foundTeam = teamDictionary[teamKey];
            return foundTeam;
        });

        const contestantRoundScores: IRound[] = league.generateContestantRoundScores(currentSelectedContestantTeamsList, numberOfRounds, contestant.name, contestant.handicap);

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

