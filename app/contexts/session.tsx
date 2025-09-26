"use client"
import { createContext, useState } from "react";
import { Session, SessionInfo } from "../models/Session";

export const SessionContext = createContext<Session>({ 
    sessionInfo: { isLoggedIn: false, userName: "Default User Name From Context", googleUserId: "xxx-xxx-xxx"},
    setSessionInfo: (_sessionInfo) => {}
});

export const SessionProvider = ({ hasSessionCookie, children }:{ hasSessionCookie: boolean, children: React.ReactNode })=> {
    const [sessionInfo, setSessionInfo] = useState<SessionInfo>({isLoggedIn: hasSessionCookie, userName: null, googleUserId: null});
    return (
        <SessionContext.Provider value={{ sessionInfo, setSessionInfo }}>
            {children}
        </SessionContext.Provider>
    );
}
