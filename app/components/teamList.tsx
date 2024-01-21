import { Fragment } from 'react'
import Team from '../models/Team'


export default function TeamList({ teamList, roundNumber }: { teamList: Team[], roundNumber: number }) {

    
    return <div>
        {teamList.map(t => {
            return (<Fragment key={"teamStanding"+t.teamName+roundNumber}>
                <p key={t.teamName+roundNumber}>
                    {t.isInPlay(roundNumber) ? t.teamName : <s>{t.teamName}</s>}
                </p>
            </Fragment>)
        })}
    </div>
}
