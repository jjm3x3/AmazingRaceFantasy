import { getData, wikiUrl } from "../utils/wikiScraping"

export default async function Scoring() {

    const wikiData = await getData()

    const currentSelectedContestant = "Jacob"

    const numberOfRounds = wikiData.props.runners.reduce(
        (acc, x) => {
            return x.eliminationOrder > acc ? x.eliminationOrder : acc
        }, 0)

    const roundScores = []
    for(let i = 1; i <= numberOfRounds; i++) {
        const roundScore = wikiData.props.runners.reduce(
            (acc, x) => {
                return x.eliminationOrder === 0 || x.eliminationOrder > i ? acc + 10 : acc
            }, 0)
        roundScores.push(roundScore)
    }

    const weeklyScore = wikiData.props.runners.reduce(
        (acc, x) => {
            return x.isParticipating ? acc + 10 : acc
        }, 0)

    const reverseTeamsList = [...wikiData.props.runners].reverse()
    let currentWeek = 0
    return (
        <div>
            <h1 className="text-2xl text-center">Current Scoring for {currentSelectedContestant}</h1>
            <br/>
            <div className="text-center">
                {roundScores.map(s => {
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
                        <br/>
                        <br/>
                    </>)
                })}
            </div>
        </div>
    )
}
