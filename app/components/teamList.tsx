import { Fragment } from 'react'
import { ITeam } from '../utils/wikiQuery'

export default function TeamList({ teamList, roundNumber }: { teamList: ITeam[], roundNumber: number }) {
    
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
