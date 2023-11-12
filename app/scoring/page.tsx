import { getData, wikiUrl } from "../utils/wikiScraping"

export default async function Scoring() {

    const wikiData = await getData()

    const currentSelectedContestant = "Jacob"

    const weeklyScore = wikiData.props.runners.reduce(
        (acc, x) => {
            return x.isParticipating ? acc + 10 : acc
        }, 0)

    return (
        <div>
            <h1 className="text-2xl text-center">Current Scoring for {currentSelectedContestant}</h1>
            <br/>
            <div className="text-center">
                {wikiData.props.runners.map(t => {
                  return (<>
                      <p key={t.teamName}>
                          {t.isParticipating ? t.teamName : <s>{t.teamName}</s>}
                      </p>
                  </>)
                })}
            </div>
            <br/>
            <p className="text-center">Weekly Total: {weeklyScore}</p>
        </div>
    )
}
