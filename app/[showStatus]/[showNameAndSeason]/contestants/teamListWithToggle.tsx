"use client";

import { useState } from "react";
import CompetingEntity from "@/app/models/CompetingEntity"
import League from "@/app/models/League";
import { CheckboxToggle, Select } from "@/app/components/baseComponents";
import TeamList from "@/app/components/teamList";

interface PlayerData {
    userId: string,
    name: string,
    ranking: string[]
}

export default function TeamListWithToggle({ playerData, contestantsData }: { 
    playerData: PlayerData[],
    contestantsData: CompetingEntity[]
}) {
    const [showEliminationStatus, setShowEliminationStatus] = useState(false);
    const defaultDataSelectOption = {
        value: "default",
        text: "Select a contestant",
        id: "default",
        key: "default",
        teamList: contestantsData
    }
    const [selectedContestant, setSelectedContestant] = useState(defaultDataSelectOption);
    const league = new League(contestantsData);
    const playerDataSelectOptions = playerData.map(contestant => {
        const computerFriendlyName = contestant.name.toLowerCase().replace(/\s/g, "-")
        return {
            key: computerFriendlyName,
            text: contestant.name,
            value: computerFriendlyName,
            id: computerFriendlyName,
            teamList: league.getTeamList(contestant.ranking)
        }
    });
    const selectOptions = [defaultDataSelectOption, ...playerDataSelectOptions];

    const onSelectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        const selectedOption = selectOptions.find(option => option.value === selectedValue);
        if (selectedOption) {
            setSelectedContestant(selectedOption);
        }
    }


    return (
        <div>
            <Select labelText={defaultDataSelectOption.text} 
                selectOptions={selectOptions} 
                id="player-selector"
                changeHandler={onSelectHandler}/>
            <div>
                <CheckboxToggle
                    id="contestant-elimination-status-toggle"
                    labelText="Show Elimination Status"
                    toggleHandler={() => setShowEliminationStatus(!showEliminationStatus)}
                    checkboxPosition="left"
                />
            </div>
            <div className="text-center" data-testid="team-list-container">
                <TeamList
                    teamList={selectedContestant.teamList}
                    showEliminationStatus={showEliminationStatus}
                />
            </div>
        </div>
    );
}