"use client"
import { useContext } from "react";
import { SessionContext } from "@/app/contexts/session";
import styles from "./sessionContextedLabel.module.scss";

export default function SessionContextedLabel() {

    const { sessionInfo } = useContext(SessionContext);

    return (
        <>
            <p className={styles.userName} >{sessionInfo.userName}</p>
        </>
    );
}
