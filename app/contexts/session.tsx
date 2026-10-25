"use client"
import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Session, SessionInfo } from "../models/Session";
import { clearLocalStorage } from "../dataSources/localStorageShim";

export const SessionContext = createContext<Session>({ 
    sessionInfo: { isLoggedIn: false, userName: "Default User Name From Context", googleUserId: "xxx-xxx-xxx"},
    setSessionInfo: (_sessionInfo) => {},
    googleSdkLoaded: false, 
    setGoogleSdkLoaded: (_isGoogleSdkLoaded) => {}
});

export const SessionProvider = ({ sessionExpiresAt, children }:{ sessionExpiresAt: number | null, children: React.ReactNode })=> {
    const [sessionInfo, setSessionInfo] = useState<SessionInfo>({isLoggedIn: sessionExpiresAt !== null, userName: null, googleUserId: null, sessionExpiresAt});
    const [googleSdkLoaded, setGoogleSdkLoaded] = useState(false);
    const router = useRouter();

    useEffect(()=> {
        const scriptTag = document.createElement("script");
        scriptTag.src = "https://accounts.google.com/gsi/client";
        scriptTag.addEventListener("load", ()=> setGoogleSdkLoaded(true));
        document.body.appendChild(scriptTag);
    }, [])

    // the server found no valid session, so drop any user data left over from an expired one
    useEffect(()=> {
        if (sessionExpiresAt === null) {
            clearLocalStorage();
        }
    }, [sessionExpiresAt])

    useEffect(()=> {
        const expiresAt = sessionInfo.sessionExpiresAt;
        if (!sessionInfo.isLoggedIn || !expiresAt) {
            return;
        }
        const msUntilExpiry = expiresAt * 1000 - Date.now();
        const timeoutId = setTimeout(()=> {
            // a promise chain, not an async callback, so a failed request can never become an unhandled rejection
            fetch("/api/logout", { method: "POST" })
                .then(() => {
                    clearLocalStorage();
                    setSessionInfo({isLoggedIn: false, userName: null, googleUserId: null, sessionExpiresAt: null});
                    router.push("/");
                })
                .catch((error) => {
                    console.warn(`Failed to clear expired session cookie: ${error}`);
                });
        }, Math.max(msUntilExpiry, 0));

        return () => clearTimeout(timeoutId);
    }, [sessionInfo.isLoggedIn, sessionInfo.sessionExpiresAt, router])
    
    return (
        <SessionContext.Provider value={{ sessionInfo, setSessionInfo, googleSdkLoaded, setGoogleSdkLoaded }}>
            {children}
        </SessionContext.Provider>
    );
}
