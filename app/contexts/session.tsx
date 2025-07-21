"use client"
import { createContext, useState } from "react";
import Session from "../models/Session";

export const SessionContext = createContext<Session>({ 
    isLoggedIn: false,
    setIsLoggedIn: (isLoggedIn)=> { return !isLoggedIn }
});

export const SessionProvider = ({ sessionCookie, children }:{ sessionCookie: string | null, children: React.ReactNode })=> {
    const [isLoggedIn, setIsLoggedIn] = useState(!!sessionCookie);
    return (
        <SessionContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </SessionContext.Provider>
    );
}