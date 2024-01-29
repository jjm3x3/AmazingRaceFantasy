import { getTeamList, ITeam } from "../utils/wikiQuery"
import { apiUrl, getWikipediaContestantData } from "../utils/wikiFetch"
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

    const andrewsRanking = [ "Corey McArthur & Rob McArthur", "Jocelyn Chao & Victor Limary", "Liam Hykel & Yeremi Hykel", "Greg Franklin & John Franklin", "Ashlie Martin & Todd Martin", "Chelsea Day & Robbin Tomich", "Lena Franklin & Morgan Franklin", "Anna Leigh Wilson & Steve Cargile", "Garrett Smith & Joel Strasser", "Ian Todd & Joe Moskowitz", "Andrea Simpson & Malaina Hatcher", "Elizabeth Rivera & Iliana Rivera", "Alexandra Lichtor & Sheridan Lichtor" ]

    const cindysRanking = [ "Jocelyn Chao & Victor Limary", "Corey McArthur & Rob McArthur", "Ian Todd & Joe Moskowitz", "Liam Hykel & Yeremi Hykel", "Ashlie Martin & Todd Martin", "Garrett Smith & Joel Strasser", "Anna Leigh Wilson & Steve Cargile", "Lena Franklin & Morgan Franklin", "Greg Franklin & John Franklin", "Andrea Simpson & Malaina Hatcher", "Chelsea Day & Robbin Tomich", "Elizabeth Rivera & Iliana Rivera", "Alexandra Lichtor & Sheridan Lichtor" ]

    const jacobsRanking = [ "Corey McArthur & Rob McArthur", "Jocelyn Chao & Victor Limary", "Lena Franklin & Morgan Franklin", "Greg Franklin & John Franklin", "Chelsea Day & Robbin Tomich", "Anna Leigh Wilson & Steve Cargile", "Ashlie Martin & Todd Martin", "Garrett Smith & Joel Strasser", "Ian Todd & Joe Moskowitz", "Andrea Simpson & Malaina Hatcher", "Liam Hykel & Yeremi Hykel", "Elizabeth Rivera & Iliana Rivera", "Alexandra Lichtor & Sheridan Lichtor" ]

    const jimsRanking = [ "Jocelyn Chao & Victor Limary", "Lena Franklin & Morgan Franklin", "Anna Leigh Wilson & Steve Cargile", "Corey McArthur & Rob McArthur", "Liam Hykel & Yeremi Hykel", "Greg Franklin & John Franklin", "Ashlie Martin & Todd Martin", "Ian Todd & Joe Moskowitz", "Andrea Simpson & Malaina Hatcher", "Chelsea Day & Robbin Tomich", "Elizabeth Rivera & Iliana Rivera", "Garrett Smith & Joel Strasser", "Alexandra Lichtor & Sheridan Lichtor" ]

    const rachelsRanking = [ "Ashlie Martin & Todd Martin", "Jocelyn Chao & Victor Limary", "Garrett Smith & Joel Strasser", "Lena Franklin & Morgan Franklin", "Ian Todd & Joe Moskowitz", "Corey McArthur & Rob McArthur", "Greg Franklin & John Franklin", "Liam Hykel & Yeremi Hykel", "Anna Leigh Wilson & Steve Cargile", "Andrea Simpson & Malaina Hatcher", "Chelsea Day & Robbin Tomich", "Elizabeth Rivera & Iliana Rivera", "Alexandra Lichtor & Sheridan Lichtor" ]

    const numberOfRounds = pageData.props.runners.reduce(
        (acc: number, x: ITeam) => {
            return x.eliminationOrder > acc ? x.eliminationOrder : acc
        }, 0)

    const reverseTeamsList = [...pageData.props.runners].reverse()

    const roundScores = generateContestantRoundScores(reverseTeamsList, numberOfRounds)

    const andrewsTeamList = andrewsRanking.map(x => {
        const foundTeam = teamDictionary[Team.getKey(x)]
        return foundTeam
    })

    const cindysTeamList = cindysRanking.map(x => {
        const foundTeam = teamDictionary[Team.getKey(x)]
        return foundTeam
    })

    const jacobsTeamsList = jacobsRanking.map(x => {
        const foundTeam = teamDictionary[Team.getKey(x)]
        return foundTeam
    })

    const jimsTeamList = jimsRanking.map(x => {
        const foundTeam = teamDictionary[Team.getKey(x)]
        return foundTeam
    })

    const rachelsTeamList = rachelsRanking.map(x => {
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
