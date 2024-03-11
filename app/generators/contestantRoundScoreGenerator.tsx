import { IWikipediaContestantData } from "../utils/wikiFetch"
import { getTeamList, ITeam } from "../utils/wikiQuery"
import Team from '../models/Team'
import LeagueStanding from '../models/LeagueStanding'

interface Dictionary<T> {
    [Key: string]: T;
}

export default async function generateContestantRoundScores(dataFetcher: () => Promise<IWikipediaContestantData[]>, listOfContestantLeagueData: any[]) {

    const wikiContestants = await dataFetcher()
    const pageData = getTeamList(wikiContestants)

    const teamDictionary = pageData.props.runners.reduce((acc: Dictionary<ITeam>, t: ITeam) => {
            acc[Team.getKey(t.teamName)] = t

            return acc
        }, {})

    const numberOfRounds = pageData.props.runners.reduce(
        (acc: number, x: ITeam) => {
            return x.eliminationOrder > acc ? x.eliminationOrder : acc
        }, 0)

    const result: LeagueStanding = new LeagueStanding()

    listOfContestantLeagueData.map(contestant => {

        const currentSelectedContestantTeamsList = contestant.ranking.map((x: string) => {
            const foundTeam = teamDictionary[Team.getKey(x)]
            return foundTeam
        })

        result.addContestantRoundScores(currentSelectedContestantTeamsList, numberOfRounds, contestant.name)

    })

    return result
}
