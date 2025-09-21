"use client"
import { useContext, useEffect } from "react";
import { SessionContext } from "@/app/contexts/session";
import styles from "./sessionContextedLabel.module.scss";

export default function SessionContextedLabel() {

    const { sessionInfo, setSessionInfo } = useContext(SessionContext);

    useEffect(() => {
        if (sessionInfo.userName === null) {
            const userName = localStorage.getItem("userName") ?? "";
            setSessionInfo({isLoggedIn: sessionInfo.isLoggedIn, userName: userName});
        }
    });

    return (
        <>
            <p className={styles.userName} >{sessionInfo.userName}</p>
        </>
    );
}
