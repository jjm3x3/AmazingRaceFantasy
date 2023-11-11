export default function Scoring() {
    var currentSelectedContestant = "Jacob"

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
        </div>
    )
}
