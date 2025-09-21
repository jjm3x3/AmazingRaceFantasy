"use client"
import { createContext, useState } from "react";
import Session from "../models/Session";

export const SessionContext = createContext<Session>({ 
    sessionInfo: { isLoggedIn: false, userName: "Default User Name From Context"},
    setSessionInfo: (_sessionInfo) => {}
});

export const SessionProvider = ({ hasSessionCookie, userName, children }:{ hasSessionCookie: boolean, userName: string, children: React.ReactNode })=> {
    const [sessionInfo, setSessionInfo] = useState({isLoggedIn: hasSessionCookie, userName});
    return (
        <SessionContext.Provider value={{ sessionInfo, setSessionInfo }}>
            {children}
        </SessionContext.Provider>
    );
}
