import { ReactNode } from 'react'
import { getTeamList, ITeam } from "../utils/wikiQuery"
import { IWikipediaContestantData } from "../utils/wikiFetch"
import Team from '../models/Team'
import { shouldBeScored } from '../utils/teamListUtils'
import ContestantRoundList from '../components/contestantRoundList'
import IRound from '../models/IRound'
import LeagueStanding from '../models/LeagueStanding'

interface Dictionary<T> {
    [Key: string]: T;
}

export default async function generateListOfContestantRoundLists(dataFetcher: () => Promise<IWikipediaContestantData[]>, listOfContestantLeagueData: any[]) {

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

    const reverseTeamsList = [...pageData.props.runners].reverse()

    const perfectScoreHandicap = 0
    const roundScores: IRound[] = LeagueStanding.generateContestantRoundScores(reverseTeamsList, numberOfRounds, "*perfect*", perfectScoreHandicap)


    return listOfContestantLeagueData.map(contestant => {

        const currentSelectedContestantTeamsList = contestant.ranking.map((x: string) => {
            const foundTeam = teamDictionary[Team.getKey(x)]
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
