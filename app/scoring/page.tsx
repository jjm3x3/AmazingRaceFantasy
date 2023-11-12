import { Fragment } from 'react'
import { getTeamList, ITeam } from "../utils/wikiQuery"
import { wikiUrl, getWikipediaContestantData } from "../utils/wikiFetch"
import TeamList from '../components/teamList'
import Team from '../models/Team'
import { shouldBeScored } from '../utils/teamListUtils'

function getKey(teamName: string): string {
    return teamName
}

export default async function Scoring() {

    const wikiContestants = await getWikipediaContestantData()
    const pageData = getTeamList(wikiContestants)

    const teamDictionary = pageData.props.runners.reduce((acc, t) => {
            acc[t.teamName] = t

            return acc
        }, {})

    const currentSelectedContestant = "Jacob"

    const currentSelectedContestantRanking = [ "Rob & Corey", "Jocelyn & Victor", "Morgan & Lena", "Greg & John", "Robbin & Chelsea", "Steve & Anna Leigh", "Ashlie & Todd", "Joel & Garrett", "Joe & Ian", "Malania & Andrea", "Liam & Yeremi", "Elizabeth & Iliana", "Alexandra & Sherida" ]

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
                                            {teamDictionary[t].isParticipating ? t : <s>{t}</s> }
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
