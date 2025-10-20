"use client"
import { createContext, useState, useEffect } from "react";
import { Session, SessionInfo } from "../models/Session";

export const SessionContext = createContext<Session>({ 
    sessionInfo: { isLoggedIn: false, userName: "Default User Name From Context", googleUserId: "xxx-xxx-xxx"},
    setSessionInfo: (_sessionInfo) => {},
    googleSdkLoaded: false, 
    setGoogleSdkLoaded: (_isGoogleSdkLoaded) => {}
});

export const SessionProvider = ({ hasSessionCookie, children }:{ hasSessionCookie: boolean, children: React.ReactNode })=> {
    const [sessionInfo, setSessionInfo] = useState<SessionInfo>({isLoggedIn: hasSessionCookie, userName: null, googleUserId: null});
    const [googleSdkLoaded, setGoogleSdkLoaded] = useState(false);

    useEffect(()=> {
        const scriptTag = document.createElement("script");
        scriptTag.src = "https://accounts.google.com/gsi/client";
        scriptTag.addEventListener("load", ()=> setGoogleSdkLoaded(true));
        document.body.appendChild(scriptTag);
    }, [])
    
    return (
        <SessionContext.Provider value={{ sessionInfo, setSessionInfo, googleSdkLoaded, setGoogleSdkLoaded }}>
            {children}
        </SessionContext.Provider>
    );
}
