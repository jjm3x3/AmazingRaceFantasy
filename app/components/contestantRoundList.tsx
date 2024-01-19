
export default function ContestantRoundList({ perfectRoundScores }) {

    let grandTotal = 0
    let contestantGrandTotal = 0

    return (
        <div className="text-center">
            {perfectRoundScores.map((score, roundNumber) => {
                grandTotal += score
                contestantGrandTotal += contestantRoundScore

                return (<><p>I Will Be A Round</p></>)
            })}
        </div>
    )
}
