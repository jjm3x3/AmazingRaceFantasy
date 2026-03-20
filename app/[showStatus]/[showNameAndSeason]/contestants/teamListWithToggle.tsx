"use client";

import { useState, useEffect } from "react";
import CompetingEntity from "@/app/models/CompetingEntity"
import League from "@/app/models/League";
import { CheckboxToggle, Select } from "@/app/components/baseComponents";
import TeamList from "@/app/components/teamList";
import styles from "./contestantsPageContent.module.scss";

type PlayerData = {
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
    const [selectOptions, setSelectedOptions] = useState([defaultDataSelectOption]);
    const league = new League(contestantsData);
    useEffect(() => {
        const fetchData = async () => {
            const playerDataSelectOptions = playerData.map(contestant => {
                return {
                    key: contestant.name.toLowerCase().replace(/\s/g, "-"),
                    text: contestant.name,
                    value: contestant.name.toLowerCase().replace(/\s/g, "-"),
                    id: contestant.name.toLowerCase().replace(/\s/g, "-"),
                    teamList: league.getTeamList(contestant.ranking)
                }
            });
            const allSelectOptions = [defaultDataSelectOption, ...playerDataSelectOptions];
            setSelectedOptions(allSelectOptions);
        }
        if(selectOptions.length === 1){
            fetchData();
        }
    }, []);

    const onSelectHandler = (e)=> {
        const selectedValue = e.target.value;
        const selectedOption = selectOptions.find(option => option.value === selectedValue);
        if (selectedOption) {
            setSelectedContestant(selectedOption);
        }
    }


    return (
        <>
            <Select labelText={defaultDataSelectOption.text} 
                selectOptions={selectOptions} 
                id="player-selector"
                changeHandler={onSelectHandler}/>
            <div className={`text-center ${styles.filterBar}`}>
                <CheckboxToggle
                    id="contestant-elimination-status-toggle"
                    labelText="Show Elimination Status"
                    toggleHandler={() => setShowEliminationStatus(!showEliminationStatus)}
                    checkboxPosition="left"
                />
            </div>
            <div className="text-center">
                <TeamList
                    teamList={selectedContestant.teamList}
                    showEliminationStatus={showEliminationStatus}
                />
            </div>
        </>
    );
}