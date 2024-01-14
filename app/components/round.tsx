import { Fragment } from 'react'

export default function Round({ roundNumber }: { roundNumber: number }) {

    return (<Fragment key={"round details"+roundNumber}>
        <h2 key={"weekHeader"+roundNumber}className="text-xl">Week {roundNumber+1}</h2>
        <br/>
    </Fragment>)
}
