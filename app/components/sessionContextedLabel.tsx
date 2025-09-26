"use client"
import { useContext, useEffect } from "react";
import { SessionContext } from "@/app/contexts/session";
import styles from "./sessionContextedLabel.module.scss";
import { getLocalUserData } from "@/app/dataSources/localStorageShim"

export default function SessionContextedLabel() {

    const { sessionInfo, setSessionInfo } = useContext(SessionContext);

    useEffect(() => {
        if (sessionInfo.userName === null || sessionInfo.googleUserId === null) {
            const userData = getLocalUserData()
            const userName = userData.userName ?? "";
            const googleUserId = userData.googleUserId ?? "";
            setSessionInfo({isLoggedIn: sessionInfo.isLoggedIn, userName: userName, googleUserId: googleUserId});
        }
    });

    return (
        <div className={`flex-container ${styles.userInfo}`}>
            <p className={"text-right"} >{sessionInfo.userName}</p>
            {sessionInfo.googleUserId! ? <p className={`text-right ${styles.googleUserId}`} >({sessionInfo.googleUserId})</p> : <p></p> }
        </div>
    );
}
