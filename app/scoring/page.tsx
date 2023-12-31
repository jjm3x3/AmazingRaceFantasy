import { Fragment } from 'react'
import { getTeamList, ITeam } from "../utils/wikiQuery"
import { wikiUrl, getWikipediaContestantData } from "../utils/wikiFetch"
import TeamList from '../components/teamList'
import Team from '../models/Team'
import { shouldBeScored } from '../utils/teamListUtils'

interface Dictionary<T> {
    [Key: string]: T;
}

function getKey(teamName: string): string {
    const names = teamName.split("&").map(s => s.trim() )
    var seed = ""
    if (names[0][0] > names[1][0]) {
        seed = names[1] + names[0]
    }
    else {
        seed = names[0] + names[1]
    }
    return seed
}

export default async function Scoring() {

    const wikiContestants = await getWikipediaContestantData()
    const pageData = getTeamList(wikiContestants)

    const teamDictionary = pageData.props.runners.reduce((acc: Dictionary<ITeam>, t: ITeam) => {
            acc[getKey(t.teamName)] = t

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

    let grandTotal = 0
    return (
        <div>
            <h1 className="text-2xl text-center">Current Scoring for {currentSelectedContestant}</h1>
            <br/>
            <div className="text-center">
                {roundScores.map((score, roundNumber) => {
                    grandTotal += score

                    return (<Fragment key={"round details"+roundNumber}>
                        <h2 key={"weekHeader"+roundNumber}className="text-xl">Week {roundNumber+1}</h2>
                        <div className="text-center flex">
                            <div className="basis-1/2">
                                <TeamList teamList={reverseTeamsList} roundNumber={roundNumber} />
                            </div>
                            <div className="basis-1/2">
                                {currentSelectedContestantRanking.map(t => {
                                    return (<>
                                        <p key={t+"current"}>
                                            {teamDictionary[getKey(t)].isParticipating ? t : <s>{t}</s> }
                                        </p>
                                    </>)
                                })}
                            </div>
                        </div>
                        <br/>
                        <p key={"weekTotal"+roundNumber}className="text-center">Weekly Total: {score}</p>
                        <p key={"grandTotal"+roundNumber}className="text-center">Grand Total: {grandTotal}</p>
                        <br/>
                        <br/>
                    </Fragment>)
                })}
            </div>
        </div>
    )
}
