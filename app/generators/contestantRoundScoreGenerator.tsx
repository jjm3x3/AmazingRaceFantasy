import { ITableRowData } from "../utils/wikiFetch"
import { getTeamList, ITeam } from "../utils/wikiQuery"
import { getNumberOfRounds } from '../utils/teamListUtils';
import Team from '../models/Team'
import LeagueStanding from '../models/LeagueStanding'

interface Dictionary<T> {
    [Key: string]: T;
}

export async function generateContestantRoundScores(pageData: any, listOfContestantLeagueData: any[]) {
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

export default async function generateContestantRoundScoreComponent(dataFetcher: () => Promise<ITableRowData[]>, listOfContestantLeagueData: any[]) {

    const contestantScores = await generateContestantRoundScores(dataFetcher, listOfContestantLeagueData)
    return contestantScores.rounds.map(roundData => {
        return <>
            <h1 className="text-2xl text-center">Week {roundData.round+1}</h1>
            <br/>
            <div className="flex flex-row">
                {roundData.contestantRoundData.map(contestantRound => {
                    return <div className="basis-1/6">
                        <h1 className="text-1xl text-center">{contestantRound.name}</h1>
                        <p className="text-center">{contestantRound.totalScore}</p>
                    </div>
                })}
            </div>
            <br/>
            <br/>
        </>
    })
}
