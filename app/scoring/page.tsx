import { getTeamList, ITeam } from "../utils/wikiQuery"
import { wikiUrl, getWikipediaContestantData } from "../utils/wikiFetch"
import Team from '../models/Team'
import { shouldBeScored } from '../utils/teamListUtils'
import ContestantRoundList from '../components/contestantRoundList'
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

    const wikiContestants = await getWikipediaContestantData()
    const pageData = getTeamList(wikiContestants)

    const teamDictionary = pageData.props.runners.reduce((acc: Dictionary<ITeam>, t: ITeam) => {
            acc[Team.getKey(t.teamName)] = t

            return acc
        }, {})

    const jacobsRanking = [ "Corey McArthur & Rob McArthur", "Jocelyn Chao & Victor Limary", "Lena Franklin & Morgan Franklin", "Greg Franklin & John Franklin", "Chelsea Day & Robbin Tomich", "Anna Leigh Wilson & Steve Cargile", "Ashlie Martin & Todd Martin", "Garrett Smith & Joel Strasser", "Ian Todd & Joe Moskowitz", "Andrea Simpson & Malaina Hatcher", "Liam Hykel & Yeremi Hykel", "Elizabeth Rivera & Iliana Rivera", "Alexandra Lichtor & Sheridan Lichtor" ]

    const andrewsRanking = [ "Corey McArthur & Rob McArthur", "Jocelyn Chao & Victor Limary", "Liam Hykel & Yeremi Hykel", "Greg Franklin & John Franklin", "Ashlie Martin & Todd Martin", "Chelsea Day & Robbin Tomich", "Lena Franklin & Morgan Franklin", "Anna Leigh Wilson & Steve Cargile", "Garrett Smith & Joel Strasser", "Ian Todd & Joe Moskowitz", "Andrea Simpson & Malaina Hatcher", "Elizabeth Rivera & Iliana Rivera", "Alexandra Lichtor & Sheridan Lichtor" ]

    const numberOfRounds = pageData.props.runners.reduce(
        (acc: number, x: ITeam) => {
            return x.eliminationOrder > acc ? x.eliminationOrder : acc
        }, 0)

    const reverseTeamsList = [...pageData.props.runners].reverse()

    const roundScores = generateContestantRoundScores(reverseTeamsList, numberOfRounds)

    const jacobsTeamsList = jacobsRanking.map(x => {
        const foundTeam = teamDictionary[Team.getKey(x)]
        return foundTeam
    })

    const andrewsTeamList = andrewsRanking.map(x => {
        const foundTeam = teamDictionary[Team.getKey(x)]
        return foundTeam
    })

    const jacobRoundScores: number[] = generateContestantRoundScores(jacobsTeamsList, numberOfRounds)

    const contestantRoundScores: number[] = generateContestantRoundScores(andrewsTeamList, numberOfRounds)

    const andrewsRoundScores: number[] = generateContestantRoundScores(andrewsTeamList, numberOfRounds)

    const listOfContestantRoundLists = [
        {
            key: "Andrew",
            content: <ContestantRoundList perfectRoundScores={roundScores} contestantRoundScores={andrewsRoundScores} perfectTeamList={reverseTeamsList} contestantTeamList={andrewsTeamList}/>
        },
        {
            key: "Jacob",
            content: <ContestantRoundList perfectRoundScores={roundScores} contestantRoundScores={jacobRoundScores} perfectTeamList={reverseTeamsList} contestantTeamList={jacobsTeamsList}/>
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
