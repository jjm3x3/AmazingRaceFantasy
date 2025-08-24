"use client"
import { useContext } from "react";
import { SessionContext } from "@/app/contexts/session";

export default function LogoutButton(){
    const { setIsLoggedIn } = useContext(SessionContext);

    function performLogout() {
        fetch("/api/logout", {
            method: "POST"
        }).then((resp) => {
            if (resp.status === 205) {
                setIsLoggedIn(false);
            } else {
                console.warn(`Unexpected status code back from /api/logout: '${resp.status}'`);
            }
        });
    }

    return (<>
        <button data-testid="logout-button-core" onClick={performLogout}>Log Out</button>
    </>);
}

