import { Fragment } from 'react'
import { getTeamList, ITeam } from "../utils/wikiQuery"
import { wikiUrl, getWikipediaContestantData } from "../utils/wikiFetch"
import { hashCode } from "../utils/helperFuncs"

function getKey(teamName: string): string {
    const names = teamName.split("&").map(s => s.trim() )
    var seed = ""
    if (names[0][0] > names[1][0]) {
        seed = names[1] + names[0]
    }
    else {
        seed = names[0] + names[1]
    }
    const code = hashCode(seed).toString()
    return code
}

export default async function Scoring() {

    const wikiContestants = await getWikipediaContestantData()
    const pageData = getTeamList(wikiContestants)

    const teamDictionary = wikiData.props.runners.reduce((acc, t) => {
            acc[getKey(t.teamName)] = t

            return acc
        }, {})

    const currentSelectedContestant = "Jacob"

    const currentSelectedContestantRanking = [ "Rob & Corey", "Jocelyn & Victor", "Morgan & Lena", "Greg & John", "Robbin & Chelsea", "Steve & Anna", "Ashlie & Todd", "Joel & Garrett", "Joe & Ian", "Malaina & Andrea", "Liam & Yeremi", "Elizabeth & Iliana", "Alexandra & Sheridan" ]

    const numberOfRounds = pageData.props.runners.reduce(
        (acc: number, x: ITeam) => {
            return x.eliminationOrder > acc ? x.eliminationOrder : acc
        }, 0)

    const roundScores = []
    for(let i = 1; i <= numberOfRounds; i++) {
        const roundScore = pageData.props.runners.reduce(
            (acc: number, x: ITeam) => {
                return x.eliminationOrder === 0 || x.eliminationOrder > i ? acc + 10 : acc
            }, 0)
        roundScores.push(roundScore)
    }

    const weeklyScore = pageData.props.runners.reduce(
        (acc: number, x: ITeam) => {
            return x.isParticipating ? acc + 10 : acc
        }, 0)

    const reverseTeamsList = [...pageData.props.runners].reverse()
    let grandTotal = 0
    let currentWeek = 0
    return (
        <div>
            <h1 className="text-2xl text-center">Current Scoring for {currentSelectedContestant}</h1>
            <br/>
            <div className="text-center">
                {roundScores.map((score, roundNumber) => {
                    grandTotal += score
                    currentWeek++

                    return (<Fragment key={"round details"+roundNumber}>
                        <h2 key={"weekHeader"+roundNumber}className="text-xl">Week {currentWeek}</h2>
                        <div className="text-center flex">
                            <div className="basis-1/2">
                                {reverseTeamsList.map(t => {
                                    return (<Fragment key={"teamStanding"+t.teamName+roundNumber}>
                                        <p key={t.teamName+roundNumber}>
                                            {t.eliminationOrder === 0 || currentWeek < t.eliminationOrder ? t.teamName : <s>{t.teamName}</s>}
                                        </p>
                                    </Fragment>)
                                })}
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
