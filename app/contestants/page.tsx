import { getTeamList } from "../utils/wikiQuery"
import { wikiUrl, getWikipediaContestantData } from "../utils/wikiFetch"

export default async function Contestants() {

    const wikiContestants = await getWikipediaContestantData()
    const final = getTeamList(wikiContestants)

    return (
        <div>
          <h1 className="text-2xl text-center">Contestants This Season</h1>
          <br/>
          <p className="text-lg text-center">{final.props.runners.length} teams</p>
          <br/>
          <div className="text-center">
              {final.props.runners.map((t: IContestant) => {
                return (<>
                    <p key={t.teamName}>
                        {t.isParticipating ? t.teamName : <s>{t.teamName}</s>}
                    </p>
                </>)
              })}
          </div>
          <div>
            <p>
              Data provided by <a className="standard-link" href={wikiUrl} >Wikipedia</a> for this season of the race
            </p>
          </div>
        </div>
    )
}
