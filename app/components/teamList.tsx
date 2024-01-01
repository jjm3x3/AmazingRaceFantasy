import { Fragment } from 'react'

export default function TeamList({ teamList, roundNumber }) {
    
    return <div>
        {teamList.map(t => {
            return (<Fragment key={"teamStanding"+t.teamName+roundNumber}>
                <p key={t.teamName+roundNumber}>
                    {t.eliminationOrder === 0 || roundNumber+1 < t.eliminationOrder ? t.teamName : <s>{t.teamName}</s>}
                </p>
            </Fragment>)
        })}
    </div>
}
