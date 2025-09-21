import { Dispatch, SetStateAction } from "react";

export default interface Session {
    sessionInfo: SessionInfo
    setSessionInfo: Dispatch<SetStateAction<SessionInfo>>
}

interface SessionInfo {
    isLoggedIn: boolean,
    userName: string | null
}
