import Round from './round'

export default function ContestantRoundList({
        perfectRoundScores,
        contestantRoundScores,
        perfectTeamList,
        contestantTeamList
    }) {

    let grandTotal = 0
    let contestantGrandTotal = 0

    return (
        <div className="text-center">
            {perfectRoundScores.map((score, roundNumber) => {
                grandTotal += score
                let contestantRoundScore = contestantRoundScores[roundNumber]
                contestantGrandTotal += contestantRoundScore

                return <Round key={"round"+roundNumber} roundNumber={roundNumber} perfectTeamList={perfectTeamList} contestantTeamList={contestantTeamList} perfectWeekScore={score} contestantWeekScore={contestantRoundScore} perfectGrandTotal={grandTotal} contestantGrandTotal={contestantGrandTotal} />
            })}
        </div>
    )
}
