"use client"
import { useContext } from "react";
import { SessionContext } from "@/app/contexts/session";

export default function SessionContextedLabel() {

    const { sessionInfo } = useContext(SessionContext);

    return (
        <>
            <p>{sessionInfo.userName}</p>
        </>
    );
}
