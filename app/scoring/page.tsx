import { getTeamList, ITeam } from "../utils/wikiQuery"
import { getWikipediaContestantData } from "../utils/wikiFetch"
import { WIKI_API_URL } from '../leagueConfiguration/AmazingRace_35'
import Team from '../models/Team'
import { shouldBeScored } from '../utils/teamListUtils'
import ContestantRoundList from '../components/contestantRoundList'
import { CONTESTANT_LEAGUE_DATA } from '../leagueData/AmazingRace_35'
import ContestantSelector from '../components/contestantSelector'

interface Dictionary<T> {
    [Key: string]: T;
}


function generateContestantRoundScores(contestantTeamsList: Team[], numberOfRounds: number) {

    const contestantRoundScores: number[] = []

    for(let i = 0; i < numberOfRounds; i++) {
        const roundScore = contestantTeamsList.reduce(
            (acc: number, x: Team) => {
                const teamShouldBeScored = shouldBeScored(contestantTeamsList, x, i)

                return teamShouldBeScored ? acc + 10 : acc
            }, 0)
        contestantRoundScores.push(roundScore)
    }

    return contestantRoundScores
}

export default async function Scoring() {

    const wikiContestants = await getWikipediaContestantData(WIKI_API_URL)
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

    const roundScores = generateContestantRoundScores(reverseTeamsList, numberOfRounds)

    // New New Way
    const listOfContestantRoundLists = CONTESTANT_LEAGUE_DATA.map(contestant => {

        const contestantsTeamList = contestant.ranking.map(x => {
            const foundTeam = teamDictionary[Team.getKey(x)]
            return foundTeam
        })

        const contestantsRoundScores: number[] = generateContestantRoundScores(contestantsTeamList, numberOfRounds)



        return {
            key: contestant.name,
            content: <ContestantRoundList perfectRoundScores={roundScores} contestantRoundScores={contestantsRoundScores} perfectTeamList={reverseTeamsList} contestantTeamList={contestantsTeamList}/>
        }

    })

    return (
        <div>
            <h1 className="text-2xl text-center">Current Scoring for</h1>
            <br/>
            <ContestantSelector listOfContestantRoundLists={listOfContestantRoundLists}/>
        </div>
    )
}
