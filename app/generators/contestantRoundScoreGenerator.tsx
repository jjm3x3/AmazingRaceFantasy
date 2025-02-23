import { ITableRowData } from "../utils/wikiFetch"
import { ITeam } from "../utils/wikiQuery"
import { getNumberOfRounds } from '../utils/teamListUtils';
import Team from '../models/Team'
import LeagueStanding from '../models/LeagueStanding'

interface Dictionary<T> {
    [Key: string]: T;
}

export async function generateContestantRoundScores(dataFetcher: () => Promise<ITableRowData[]>, getCompetitorList: any, listOfContestantLeagueData: any[]) {
    const wikiData = await dataFetcher();
    const pageData = getCompetitorList(wikiData);
    const teamDictionary = pageData.props.runners.reduce((acc: Dictionary<ITeam>, t: ITeam) => {
            acc[Team.getKey(t.teamName)] = t

            return acc
        }, {})
    const numberOfRounds = getNumberOfRounds(pageData.props.runners)

    const result: LeagueStanding = new LeagueStanding()

    listOfContestantLeagueData.map(contestant => {

        const currentSelectedContestantTeamsList = contestant.ranking.map((x: string) => {
            const foundTeam = teamDictionary[Team.getKey(x)]
            return foundTeam
        })

        result.addContestantRoundScores(currentSelectedContestantTeamsList, numberOfRounds, contestant.name, contestant.handicap)

    })

    return result
}
