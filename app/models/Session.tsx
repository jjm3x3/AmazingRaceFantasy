import { Dispatch, SetStateAction } from "react";

export interface Session {
    sessionInfo: SessionInfo
    setSessionInfo: Dispatch<SetStateAction<SessionInfo>>
    googleSdkLoaded: boolean, 
    setGoogleSdkLoaded: Dispatch<SetStateAction<boolean>>
}

export interface SessionInfo {
    userName: string | null,
    googleUserId: string | null,
    // unix time in seconds when the session token expires
    sessionExpiresAt?: number | null
}
