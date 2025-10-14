"use client"
import { useContext } from "react";
import { SessionContext } from "@/app/contexts/session";
import { clearLocalStorage } from "@/app/dataSources/localStorageShim";

export default function LogoutButton(){
    const { setSessionInfo } = useContext(SessionContext);

    function performLogout() {
        const result = fetch("/api/logout", {
            method: "POST"
        });
        result.then((resp) => {
            if (resp.status === 205) {
                clearLocalStorage();
                setSessionInfo({isLoggedIn: false, userName: null, googleUserId: null});
            } else {
                console.warn(`Unexpected status code back from /api/logout: '${resp.status}'`);
            }
        });
    }

    return (<>
        <button data-testid="logout-button-core" onClick={performLogout}>Log Out</button>
    </>);
}

