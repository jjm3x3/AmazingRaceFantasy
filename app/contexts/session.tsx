"use client"
import { createContext, useState } from "react";
import Session from "../models/Session";

export const SessionContext = createContext<Session>({ 
    sessionInfo: { isLoggedIn: false },
    setSessionInfo: (_sessionInfo) => {}
});

export const SessionProvider = ({ hasSessionCookie, children }:{ hasSessionCookie: boolean, children: React.ReactNode })=> {
    const [sessionInfo, setSessionInfo] = useState({isLoggedIn: hasSessionCookie});
    return (
        <SessionContext.Provider value={{ sessionInfo, setSessionInfo }}>
            {children}
        </SessionContext.Provider>
    );
}
