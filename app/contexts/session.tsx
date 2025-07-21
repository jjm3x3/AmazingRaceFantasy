"use client"
import { createContext, useState } from "react";
import Session from "../models/Session";

export const SessionContext = createContext<Session>({ 
    isLoggedIn: false,
    setIsLoggedIn: (isLoggedIn)=> { return !isLoggedIn }
});

export const SessionProvider = ({ hasSessionCookie, children }:{ hasSessionCookie: boolean, children: React.ReactNode })=> {
    const [isLoggedIn, setIsLoggedIn] = useState(hasSessionCookie);
    return (
        <SessionContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </SessionContext.Provider>
    );
}