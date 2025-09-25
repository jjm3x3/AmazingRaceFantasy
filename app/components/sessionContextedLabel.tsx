"use client"
import { useContext, useEffect } from "react";
import { SessionContext } from "@/app/contexts/session";
import styles from "./sessionContextedLabel.module.scss";
import { getLocalUserData } from "@/app/dataSources/localStorageShim"

export default function SessionContextedLabel() {

    const { sessionInfo, setSessionInfo } = useContext(SessionContext);

    useEffect(() => {
        if (sessionInfo.userName === null) {
            const userData = getLocalUserData()
            const userName = userData.userName ?? "";
            setSessionInfo({isLoggedIn: sessionInfo.isLoggedIn, userName: userName});
        }
    });

    return (
        <>
            <p className={styles.userName} >{sessionInfo.userName}</p>
        </>
    );
}
