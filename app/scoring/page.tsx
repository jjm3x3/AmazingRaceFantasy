import { Fragment } from 'react'
import { getTeamList, ITeam } from "../utils/wikiQuery"
import { wikiUrl, getWikipediaContestantData } from "../utils/wikiFetch"

export default async function Scoring() {

    const wikiContestants = await getWikipediaContestantData()
    const pageData = getTeamList(wikiContestants)

    const currentSelectedContestant = "Jacob"

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

    const reverseTeamsList = [...pageData.props.runners].reverse()
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
                        {reverseTeamsList.map(t => {
                            return (<Fragment key={"teamStanding"+t.teamName+roundNumber}>
                                <p key={t.teamName+roundNumber}>
                                    {t.eliminationOrder === 0 || roundNumber+1 < t.eliminationOrder ? t.teamName : <s>{t.teamName}</s>}
                                </p>
                            </Fragment>)
                        })}
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
