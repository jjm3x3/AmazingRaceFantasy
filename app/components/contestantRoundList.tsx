import Round from './round'

export default function ContestantRoundList({ perfectRoundScores, contestantRoundScores }) {

    let grandTotal = 0
    let contestantGrandTotal = 0

    return (
        <div className="text-center">
            {perfectRoundScores.map((score, roundNumber) => {
                grandTotal += score
                let contestantRoundScore = contestantRoundScores[roundNumber]
                contestantGrandTotal += contestantRoundScore

                return (<><p>I Will Be A Round</p></>)
            })}
        </div>
    )
}
