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
                {roundScores.map(s => {
                    grandTotal += s
                    currentWeek++

                    return (<>
                        <h2 className="text-xl">Week {currentWeek}</h2>
                        {reverseTeamsList.map(t => {
                            return (<>
                                <p key={t.teamName}>
                                    {t.eliminationOrder === 0 || currentWeek < t.eliminationOrder ? t.teamName : <s>{t.teamName}</s>}
                                </p>
                            </>)
                        })}
                        <br/>
                        <p className="text-center">Weekly Total: {s}</p>
                        <p className="text-center">Grand Total: {grandTotal}</p>
                        <br/>
                        <br/>
                    </>)
                })}
            </div>
        </div>
    )
}
