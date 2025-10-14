import { Dispatch, SetStateAction } from "react";

export interface Session {
    sessionInfo: SessionInfo
    setSessionInfo: Dispatch<SetStateAction<SessionInfo>>
}

export interface SessionInfo {
    isLoggedIn: boolean,
    userName: string | null,
    googleUserId: string | null
}
