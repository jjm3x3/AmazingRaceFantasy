"use client";

import { useState } from "react";
import CompetingEntity from "@/app/models/CompetingEntity"
import CheckboxToggle from "@/app/components/baseComponents/components/inputs/checkboxToggle/checkboxToggle";
import styles from "./contestantsPageContent.module.scss";

export default function ContestantsPageContent({ contestantsData }: { 
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
                {contestantsData.map((t: CompetingEntity) => {
                    return (<>
                        <p key={t.teamName}>
                            {(!t.isParticipating && showEliminationStatus) ? <s>{t.teamName}</s> : t.teamName }
                        </p>
                    </>);
                })}
            </div>
        </>
    );
}