'use client'
import { Fragment, useState, ReactNode } from 'react'

type ContestantSelectorProps = {
    listOfContestantRoundLists: {
        key: string
        content: ReactNode
    }[]
}

export default function ContestantSelector({ listOfContestantRoundLists }: ContestantSelectorProps) {

    const [selectedContestant, setSelectedContestant] = useState("Andrew")

    const filteredItems = listOfContestantRoundLists
        .filter(item => item.key == selectedContestant)
        .map(item => item.content)

    return (
        <div className="justify-center">
            <div className="flex justify-center">
                <select value={selectedContestant} onChange={e => setSelectedContestant(e.target.value)}>
                    <option>Jacob</option>
                </select>
            </div>
            <br />
            <div>
                {filteredItems}
            </div>
        </div>
    )
}
