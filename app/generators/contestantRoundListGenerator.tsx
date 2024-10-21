import { ReactNode } from 'react'
import { getTeamList, ITeam } from "../utils/wikiQuery"
import { ITableRowData } from "../utils/wikiFetch"
import Team from '../models/Team'
import { getNumberOfRounds } from '../utils/teamListUtils'
import ContestantRoundList from '../components/contestantRoundList'
import IRound from '../models/IRound'
import LeagueStanding from '../models/LeagueStanding'

interface Dictionary<T> {
    [Key: string]: T;
}

export default async function generateListOfContestantRoundLists(
    dataFetcher: () => Promise<ITableRowData[]>,
    listOfContestantLeagueData: any[],
    getCompetingEntityListFunction: (x: ITableRowData[]) => any = getTeamList,
) {

    const wikiContestants = await dataFetcher()
    const pageData = getCompetingEntityListFunction(wikiContestants)

    const teamDictionary = pageData.props.runners.reduce((acc: Dictionary<ITeam>, t: ITeam) => {
            acc[Team.getKey(t.teamName)] = t

            return acc
        }, {})

    const numberOfRounds = getNumberOfRounds(pageData.props.runners)

    const reverseTeamsList = [...pageData.props.runners].reverse()

    const perfectScoreHandicap = 0
    const roundScores: IRound[] = LeagueStanding.generateContestantRoundScores(reverseTeamsList, numberOfRounds, "*perfect*", perfectScoreHandicap)


    return listOfContestantLeagueData.map(contestant => {

        const currentSelectedContestantTeamsList = contestant.ranking.map((x: string) => {
            const teamKey = Team.getKey(x)
            const foundTeam = teamDictionary[teamKey]
            return foundTeam
        })

        const contestantRoundScores: IRound[] = LeagueStanding.generateContestantRoundScores(currentSelectedContestantTeamsList, numberOfRounds, contestant.name, contestant.handicap)

        return {
            key: contestant.name,
            content: <ContestantRoundList
                perfectRoundScores={roundScores}
                contestantRoundScores={contestantRoundScores}
                perfectTeamList={reverseTeamsList}
                contestantTeamList={currentSelectedContestantTeamsList}
                contestantName={contestant.name}
            />
        }
    })
}

