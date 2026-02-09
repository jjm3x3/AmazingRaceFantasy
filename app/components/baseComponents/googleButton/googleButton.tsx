"use client"
import { useEffect, useRef, useContext } from "react";
import { SessionContext } from "@/app/contexts/session";
import { setLocalUserData } from "@/app/dataSources/localStorageShim";
import config from "@/app/config";
import { useRouter } from "next/navigation";
import { GoogleLoginResponse } from "./models";

export default function GoogleButton({classes, googleButtonText, endpoint, setError }: {
    classes?: string, 
    googleButtonText: "signin" | "signup_with", 
    endpoint: "/api/login" | "/api/account",
    setError: (_error: boolean) => void
}){
    const { setSessionInfo, googleSdkLoaded } = useContext(SessionContext);
    const googleCreateRef = useRef(null);
    const router = useRouter();

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
        }).then(handleAccountServiceResponse);
    }

    async function handleAccountServiceResponse(response: Response) {
        if (response.status === 409) {
            setError(true); // since we are using a boolean we are assuming this is the only error possible at this time
        } else {
            const data = await response.json();
            setLocalUserData({userName: data.name.firstName, googleUserId: data.googleUserId});
            setSessionInfo({isLoggedIn: true, userName: data.name.firstName, googleUserId: data.googleUserId});
            router.push("/");
        }
    }

    return (<>
        <div ref={googleCreateRef} id="google_btn" className={classes}/>
    </>);
}
