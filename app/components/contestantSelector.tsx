'use client'
import { Fragment, useState, ReactNode } from 'react'

type ContestantSelectorProps = {
    listOfContestantRoundLists: {
        key: string
        content: ReactNode
    }[]
}

export default function ContestantSelector({ listOfContestantRoundLists }: ContestantSelectorProps) {

    const [selectedContestant, setSelectedContestant] = useState("Jacob")

    const filteredItems = listOfContestantRoundLists
        .filter(item => item.key == selectedContestant)
        .map((item, index) => <div key={"contestantRoundList-"+index}>{item.content}</div>)

    return (
        <div className="justify-center">
            <div className="flex justify-center">
                <select data-testid="contestants-selector" value={selectedContestant} onChange={e => setSelectedContestant(e.target.value)}>
                    <option data-testid="jacob-contestant">Jacob</option>
                </select>
            </div>
            <br />
            <div>
                {filteredItems}
            </div>
        </div>
    )
}
