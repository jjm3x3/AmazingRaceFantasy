import { Dispatch, SetStateAction } from "react";

export interface Session {
    sessionInfo: SessionInfo
    setSessionInfo: Dispatch<SetStateAction<SessionInfo>>
    googleSdkLoaded: boolean, 
    setGoogleSdkLoaded: Dispatch<SetStateAction<boolean>>
}

export interface SessionInfo {
    isLoggedIn: boolean,
    userName: string | null,
    googleUserId: string | null
}
