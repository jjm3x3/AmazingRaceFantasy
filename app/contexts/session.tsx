"use client"
import { createContext, useState } from "react";
import Session from "../models/Session";

export const SessionContext = createContext<Session>({ 
    sessionInfo: { isLoggedIn: false, userName: "Default User Name From Context"},
    setSessionInfo: (_sessionInfo) => {}
});

export const SessionProvider = ({ hasSessionCookie, children }:{ hasSessionCookie: boolean, children: React.ReactNode })=> {
    const [sessionInfo, setSessionInfo] = useState({isLoggedIn: hasSessionCookie, userName: null});
    return (
        <SessionContext.Provider value={{ sessionInfo, setSessionInfo }}>
            {children}
        </SessionContext.Provider>
    );
}
