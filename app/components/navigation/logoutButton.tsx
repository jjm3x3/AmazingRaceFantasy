"use client"
import { useContext } from "react";
import { SessionContext } from "@/app/contexts/session";

export default function LogoutButton(){
    const { setIsLoggedIn } = useContext(SessionContext);

    function performLogout() {
        fetch("/api/logout", {
            method: "POST"
        }).then((resp) => {
            console.log(resp);
        });
    }

    return (<>
        <button onClick={performLogout}>Log Out</button>
    </>);
}
