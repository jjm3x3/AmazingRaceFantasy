"use client"
import { useEffect, useRef, useContext, useState } from "react";
import { SessionContext } from "@/app/contexts/session";
import { setLocalUserData } from "@/app/dataSources/localStorageShim";
import config from "@/app/config";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "./models";
import ErrorMessage from "@/app/components/baseComponents/components/errorMessage/errorMessage";

export default function GoogleButton({classes, text, endpoint, errorMessage, testId}: {
    classes: string, 
    text: "signin" | "signup_with", 
    endpoint: "/api/login" | "/api/account", 
    errorMessage: string,
    testId: string
}){
    const { setSessionInfo, googleSdkLoaded } = useContext(SessionContext);
    const googleCreateRef = useRef(null);
    const router = useRouter();
    const [getError, setError] = useState(false);

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
                    text: text,
                    size: "medium",
                    logo_alignment: "left",
                    shape: "rectangular",
                    theme: "outline",
                    type: "standard"
                });
            }
        }
    }, [googleSdkLoaded]);

    function handleCredentialResponse(response:GoogleLogin) {
        fetch(endpoint, {
            method: "POST",
            body: JSON.stringify({ token: response.credential }),
        }).then(handleLogin);
    }

    async function handleLogin(response: Response) {
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
        <div ref={googleCreateRef} id="google_create_btn" className={classes}/>
        { getError ? <div data-testid={testId}>
            <ErrorMessage message={errorMessage}/>
        </div> : <div/> }
    </>);
}
