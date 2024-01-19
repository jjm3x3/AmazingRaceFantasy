import { getTeamList, ITeam } from "../utils/wikiQuery"
import { wikiUrl, getWikipediaContestantData } from "../utils/wikiFetch"
import Team from '../models/Team'
import { shouldBeScored } from '../utils/teamListUtils'
import Round from '../components/round'
import ContestantRoundList from '../components/contestantRoundList'

interface Dictionary<T> {
    [Key: string]: T;
}

export default async function Scoring() {

    const wikiContestants = await getWikipediaContestantData()
    const pageData = getTeamList(wikiContestants)

    const teamDictionary = pageData.props.runners.reduce((acc: Dictionary<ITeam>, t: ITeam) => {
            acc[Team.getKey(t.teamName)] = t

            return acc
        }, {})

    const currentSelectedContestant = "Jacob"

    const currentSelectedContestantRanking = [ "Corey McArthur & Rob McArthur", "Jocelyn Chao & Victor Limary", "Lena Franklin & Morgan Franklin", "Greg Franklin & John Franklin", "Chelsea Day & Robbin Tomich", "Anna Leigh Wilson & Steve Cargile", "Ashlie Martin & Todd Martin", "Garrett Smith & Joel Strasser", "Ian Todd & Joe Moskowitz", "Andrea Simpson & Malaina Hatcher", "Liam Hykel & Yeremi Hykel", "Elizabeth Rivera & Iliana Rivera", "Alexandra Lichtor & Sheridan Lichtor" ]

    const numberOfRounds = pageData.props.runners.reduce(
        (acc: number, x: ITeam) => {
            return x.eliminationOrder > acc ? x.eliminationOrder : acc
        }, 0)

    const reverseTeamsList = [...pageData.props.runners].reverse()

    const roundScores = []
    for(let i = 0; i < numberOfRounds; i++) {
        const roundScore = pageData.props.runners.reduce(
            (acc: number, x: Team) => {
                const teamShouldBeScored = shouldBeScored(reverseTeamsList, x, i)

                return teamShouldBeScored ? acc + 10 : acc
            }, 0)
        roundScores.push(roundScore)
    }

    const currentSelectedContestantTeamsList = currentSelectedContestantRanking.map(x => {
        const foundTeam = teamDictionary[Team.getKey(x)]
        return foundTeam
    })

    const contestantRoundScores: number[] = []
    for(let i = 0; i < numberOfRounds; i++) {
        const roundScore = currentSelectedContestantTeamsList.reduce(
            (acc: number, x: Team) => {
                const teamShouldBeScored = shouldBeScored(currentSelectedContestantTeamsList, x, i)

                return teamShouldBeScored ? acc + 10 : acc
            }, 0)
        contestantRoundScores.push(roundScore)
    }


    let grandTotal = 0
    let contestantGrandTotal = 0
    return (
        <div>
            <h1 className="text-2xl text-center">Current Scoring for {currentSelectedContestant}</h1>
            <br/>
            <ContestantRoundList perfectRoundScores={roundScores} contestantRoundScores={contestantRoundScores} perfectTeamList={reverseTeamsList} contestantTeamList={currentSelectedContestantTeamsList}/>
            <div className="text-center">
                {roundScores.map((score, roundNumber) => {
                    grandTotal += score
                    let contestantRoundScore = contestantRoundScores[roundNumber]
                    contestantGrandTotal += contestantRoundScore

                    return <Round
                        key={"round"+roundNumber}
                        roundNumber={roundNumber}
                        perfectTeamList={reverseTeamsList}
                        contestantTeamList={currentSelectedContestantTeamsList}
                        perfectWeekScore={score}
                        contestantWeekScore={contestantRoundScore}
                        perfectGrandTotal={grandTotal}
                        contestantGrandTotal={contestantGrandTotal}
                    />
                })}
            </div>
        </div>
    )
}
