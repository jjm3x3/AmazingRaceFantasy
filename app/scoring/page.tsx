import { getTeamList, ITeam } from "../utils/wikiQuery"
import { getWikipediaContestantData } from "../utils/wikiFetch"
import { WIKI_API_URL } from '../leagueConfiguration/AmazingRace_35'
import Team from '../models/Team'
import { shouldBeScored } from '../utils/teamListUtils'
import ContestantRoundList from '../components/contestantRoundList'
import { CONTESTANT_LEAGUE_DATA } from '../leagueData/AmazingRace_35'
import ContestantSelector from '../components/contestantSelector'
import generateListOfContestantRoundLists from '../generators/contestantRoundListGenerator'

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

    const listOfContestantRoundLists = await generateListOfContestantRoundLists(WIKI_API_URL, CONTESTANT_LEAGUE_DATA)

    return (
        <div>
            <h1 className="text-2xl text-center">Current Scoring for</h1>
            <br/>
            <ContestantSelector listOfContestantRoundLists={listOfContestantRoundLists}/>
        </div>
    )
}
