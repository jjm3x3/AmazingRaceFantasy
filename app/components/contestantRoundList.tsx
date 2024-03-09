import Round from './round'
import Team from '../models/Team'

export default function ContestantRoundList({
        perfectRoundScores,
        contestantRoundScores,
        perfectTeamList,
        contestantTeamList,
        contestantName
    }: {
        perfectRoundScores: any[]
        contestantRoundScores: any[]
        perfectTeamList: Team[]
        contestantTeamList: Team[]
        contestantName: string
    }) {

    return (<>
        <div className="text-center">
            {perfectRoundScores.map((round, roundNumber) => {
                if (roundNumber !== round.round) {
                    console.warn("Something is wrong that the rounds are out of order")
                }

                const perfectRound = round.contestantRoundData.filter((x: any) => x.name === "*perfect*")[0]
                const perfectScore = perfectRound.roundScore
                const grandTotal = perfectRound.totalScore

                const contestantRound = contestantRoundScores[roundNumber] // check round number
                const filteredContestantRound = contestantRound.contestantRoundData.filter((x: any) => x.name === contestantName)[0]
                const contestantRoundScore = filteredContestantRound.roundScore
                const contestantGrandTotal = filteredContestantRound.totalScore

                return <Round
                    key={"round"+roundNumber}
                    roundNumber={roundNumber}
                    perfectTeamList={perfectTeamList}
                    contestantTeamList={contestantTeamList}
                    perfectWeekScore={perfectScore}
                    contestantWeekScore={contestantRoundScore}
                    perfectGrandTotal={grandTotal}
                    contestantGrandTotal={contestantGrandTotal}
                />
            })}
        </div>
    </>)
}
