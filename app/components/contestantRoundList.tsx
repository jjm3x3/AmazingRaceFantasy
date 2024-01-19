
export default function ContestantRoundList({ perfectRoundScores }) {

    return (
        <div className="text-center">
            {perfectRoundScores.map((score, roundNumber) => {

                return (<><p>I Will Be A Round</p></>)
            })}
        </div>
    )
}
