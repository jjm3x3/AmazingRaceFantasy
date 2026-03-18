"use client";

import { useState } from "react";
import CompetingEntity from "@/app/models/CompetingEntity"
import CheckboxToggle from "@/app/components/baseComponents/components/inputs/checkboxToggle/checkboxToggle";
import TeamList from "@/app/components/teamList";
import styles from "./contestantsPageContent.module.scss";

export default function TeamListWithToggle({ contestantsData }: { 
    contestantsData: CompetingEntity[]
}) {
    const [showEliminationStatus, setShowEliminationStatus] = useState(false);
    return (
        <>
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
                    teamList={contestantsData}
                    showEliminationStatus={showEliminationStatus}
                />
            </div>
        </>
    );
}