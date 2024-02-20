import { getTeamList, ITeam } from "../utils/wikiQuery"
import { getWikipediaContestantData } from "../utils/wikiFetch"
import { WIKI_API_URL } from '../leagueConfiguration/AmazingRace_35'
import Team from '../models/Team'
import { shouldBeScored } from '../utils/teamListUtils'
import ContestantRoundList from '../components/contestantRoundList'
import { ANDREWS_RANKING, CINDYS_RANKING, JACOBS_RANKING, JIMS_RANKING, RACHELS_RANKING } from '../leagueData/AmazingRace_35'
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

    const andrewsTeamList = ANDREWS_RANKING.map(x => {
        const foundTeam = teamDictionary[Team.getKey(x)]
        return foundTeam
    })

    const cindysTeamList = CINDYS_RANKING.map(x => {
        const foundTeam = teamDictionary[Team.getKey(x)]
        return foundTeam
    })

    const jacobsTeamsList = JACOBS_RANKING.map(x => {
        const foundTeam = teamDictionary[Team.getKey(x)]
        return foundTeam
    })

    const jimsTeamList = JIMS_RANKING.map(x => {
        const foundTeam = teamDictionary[Team.getKey(x)]
        return foundTeam
    })

    const rachelsTeamList = RACHELS_RANKING.map(x => {
        const foundTeam = teamDictionary[Team.getKey(x)]
        return foundTeam
    })

    const andrewsRoundScores: number[] = generateContestantRoundScores(andrewsTeamList, numberOfRounds)

    const cindyRoundScores: number[] = generateContestantRoundScores(cindysTeamList, numberOfRounds)

    const jacobRoundScores: number[] = generateContestantRoundScores(jacobsTeamsList, numberOfRounds)

    const jimRoundScores: number[] = generateContestantRoundScores(jimsTeamList, numberOfRounds)

    const rachelRoundScores: number[] = generateContestantRoundScores(rachelsTeamList, numberOfRounds)

    const listOfContestantRoundLists = [
        {
            key: "Andrew",
            content: <ContestantRoundList perfectRoundScores={roundScores} contestantRoundScores={andrewsRoundScores} perfectTeamList={reverseTeamsList} contestantTeamList={andrewsTeamList}/>
        },
        {
            key: "Cindy",
            content: <ContestantRoundList perfectRoundScores={roundScores} contestantRoundScores={cindyRoundScores} perfectTeamList={reverseTeamsList} contestantTeamList={cindysTeamList}/>
        },
        {
            key: "Jacob",
            content: <ContestantRoundList perfectRoundScores={roundScores} contestantRoundScores={jacobRoundScores} perfectTeamList={reverseTeamsList} contestantTeamList={jacobsTeamsList}/>
        },
        {
            key: "Jim",
            content: <ContestantRoundList perfectRoundScores={roundScores} contestantRoundScores={jimRoundScores} perfectTeamList={reverseTeamsList} contestantTeamList={jimsTeamList}/>
        },
        {
            key: "Rachel",
            content: <ContestantRoundList perfectRoundScores={roundScores} contestantRoundScores={rachelRoundScores} perfectTeamList={reverseTeamsList} contestantTeamList={rachelsTeamList}/>
        }
    ]

    return (
        <div>
            <h1 className="text-2xl text-center">Current Scoring for</h1>
            <br/>
            <ContestantSelector listOfContestantRoundLists={listOfContestantRoundLists}/>
        </div>
    )
}
