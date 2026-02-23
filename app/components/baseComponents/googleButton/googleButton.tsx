"use client"
import { useEffect, useRef, useContext } from "react";
import { SessionContext } from "@/app/contexts/session";
import config from "@/app/config";
import { GoogleLoginResponse } from "./models";

export default function GoogleButton({
    classes,
    googleButtonText,
    endpoint,
    accountServiceResponseHandler
}: {
    classes?: string, 
    googleButtonText: "signin" | "signup_with", 
    endpoint: "/api/login" | "/api/account",
    accountServiceResponseHandler: (_response: Response) => void
}){
    const { googleSdkLoaded } = useContext(SessionContext);
    const googleCreateRef = useRef(null);

    useEffect(()=> {
        if(googleSdkLoaded && window.google){
            const google = window.google;
            google.accounts.id.initialize({
                client_id: config.googleAuthClientId,
                callback: handleCredentialResponse,
                use_fedcm_for_prompt: true
            });
            const parent = googleCreateRef.current;
            if(googleCreateRef && parent){
                google.accounts.id.renderButton(parent, {
                    text: googleButtonText,
                    size: "medium",
                    logo_alignment: "left",
                    shape: "rectangular",
                    theme: "outline",
                    type: "standard"
                });
            }
        }
    }, [googleSdkLoaded]);

    function handleCredentialResponse(response: GoogleLoginResponse) {
        fetch(endpoint, {
            method: "POST",
            body: JSON.stringify({ token: response.credential }),
        }).then(accountServiceResponseHandler);
    }

    return (<>
        <div ref={googleCreateRef} id="google_btn" className={classes}/>
    </>);
}
