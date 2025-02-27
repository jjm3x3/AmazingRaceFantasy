"use client";
import { useState, ReactNode } from "react";

type ContestantSelectorProps = {
    listOfContestantRoundLists: {
        key: string
        content: ReactNode
    }[]
}

export default function ContestantSelector({ listOfContestantRoundLists }: ContestantSelectorProps) {

    const [selectedContestant, setSelectedContestant] = useState(listOfContestantRoundLists[0].key);

    const filteredItems = listOfContestantRoundLists
        .filter(item => item.key == selectedContestant)
        .map((item, index) => <div key={"contestantRoundList-"+index}>{item.content}</div>);

    return (
        <div className="justify-center">
            <div className="flex justify-center">
                <select data-testid="contestants-selector" value={selectedContestant} onChange={e => setSelectedContestant(e.target.value)}>
                    {listOfContestantRoundLists.map(opt => {
                        return <option key={"option"+opt.key} data-testid={"option"+opt.key}>{opt.key}</option>;
                    })}
                </select>
            </div>
            <br />
            <div>
                {filteredItems}
            </div>
        </div>
    );
}
